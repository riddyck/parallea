export class ParalleaActorSheet extends ActorSheet{
    
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["parallea", "sheet", "actor"],
            width: 600,
            height: 600,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "features" }]
        });
    }
    
    get template(){
        //console.log(`${this.actor.type}`);
        return `systems/parallea/templates/sheets/${this.actor.type}-sheet.html`
    }
    
    getData(){
        const context = super.getData();
        const actorData = this.actor.toObject(false);
        
        context.system = actorData.system;
        context.flags = actorData.flags;
        
        context.config= CONFIG.PARALLEA;
        
        // Prepare character data and items.
        if (actorData.type == 'player') {
            this._prepareItems(context);
            //REVOIR CA QUAND J'AURAI DES ITEMS A AJOUTER
            //this._prepareCharacterData(context);
            //Derniè-re ligne sert surtout à la traduciton, pas mon problème du coup
        }
        
        // Prepare NPC data and items.
        if (actorData.type == 'npc') {
            //this._prepareItems(context);
        }
        
        // Add roll data for TinyMCE editors.
        context.rollData = context.actor.getRollData();
        
        // Prepare active effects
        //context.effects = prepareActiveEffectCategories(this.actor.effects);
        return context;
    }
    
    
    
    _prepareItems(context) {
        // Initialize containers.
        const arsenal = [];
        const gear = [];
        const skills = [];
        const spells = [];
        
        // Iterate through items, allocating to containers
        for (let i of context.items) {
            i.img = i.img || DEFAULT_TOKEN;
            // Append weapons to arsenal.
            if (i.type === 'weapon') {
                arsenal.push(i);
            }
            // Append armors to gear.
            else if (i.type === 'armor') {
                gear.push(i);
            }
            // Append to skills.
            else if (i.type === 'skill') {
                skills.push(i);
            }
            // Append to spells.
            else if (i.type === 'spell') {
                spells.push(i);
            }
        }
        
    // Assign and return
    context.arsenal = arsenal;
    context.gear = gear;
    context.skills = skills;
    context.spells = spells;

    }
    
    
    
    
    
    /* -------------------------------------------- */
    
    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        
        // Render the item sheet for viewing/editing prior to the editable check.
        html.find('.item-edit').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            item.sheet.render(true);
        });
        
        // -------------------------------------------------------------
        // Everything below here is only needed if the sheet is editable
        if (!this.isEditable) return;
        
        // Add Inventory Item
        html.find('.item-create').click(this._onItemCreate.bind(this));
        
        // Delete Inventory Item
        html.find('.item-delete').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            item.delete();
            li.slideUp(200, () => this.render(false));
        });
        
        //Listen Rollable Items
        html.find('.rollable').click(this._onRoll.bind(this));
        
    }
    
    
    async _onItemCreate(event) {

        event.preventDefault();
        const header = event.currentTarget;
        // Get the type of item to create.
        const type = header.dataset.type;
        // Grab any data associated with this control.
        const data = duplicate(header.dataset);
        // Initialize a default name.
        const name = `New ${type.capitalize()}`;
        // Prepare the item object.
        const itemData = {
            name: name,
            type: type,
            system: data,
            img: this._getItemIcon(type)
        };
        // Remove the type from the dataset since it's in the itemData.type prop.
        delete itemData.system["type"];
        
        // Finally, create the item!
        return await Item.create(itemData, {parent: this.actor});
    }
    
    _onRoll(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;
        console.log("Dataset",dataset);
        
        // Handle item rolls.
        if (dataset.rollType) {
            if (dataset.rollType == 'item') {
                const itemId = element.closest('.item').dataset.itemId;
                const item = this.actor.items.get(itemId);
                if (item) return item.roll(dataset.rollCategory);
            }
        }
        
        // Handle rolls that supply the formula directly.
        if (dataset.roll) {
            let label = dataset.label ? `Jet de ${dataset.label}` : '';
            let roll = new Roll(dataset.roll, this.actor.getRollData());
            roll.toMessage({
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                flavor: label,
                rollMode: game.settings.get('core', 'rollMode')
            });
            return roll;
        }
    }
    

    _getItemIcon(type){
        switch(type){
            case 'weapon':
                return CONFIG.PARALLEA.images.sword;
            case 'armor':
                return CONFIG.PARALLEA.images.shield;
            case 'spell':
                return CONFIG.PARALLEA.images.lightning;
            case 'skill':
                return CONFIG.PARALLEA.images.book;
            default:
                return CONFIG.PARALLEA.images.itemBag;
        }
    }
}

