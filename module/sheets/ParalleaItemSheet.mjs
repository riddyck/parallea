export class ParalleaItemSheet extends ItemSheet{
    
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["parallea", "sheet", "item"],
            width: 520,
            height: 480,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
        });
    }
    
    get template(){
        return `systems/parallea/templates/sheets/${this.item.type}-sheet.html`;
    }
    
    
    
    getData(){
        const context = super.getData();
        const itemData = this.item.toObject(false);

        context.system = itemData.system;
        context.flags = itemData.flags;
        
        // Retrieve the roll data for TinyMCE editors.
        context.rollData = {};
        
        let actor = this.object?.parent ?? null;
        if (actor) {
            context.rollData = actor.getRollData();
        }
                
        //Mettre config sert dans le cas de menus déroulant par exemple
        context.config= CONFIG.PARALLEA;
        
        context.system = itemData.system;
        context.flags = itemData.flags;

        if (!context.items) context.items=[];
        return context;
    }
    
    _prepareRune(context) {
        // Initialize containers.
        const runes = [];

        console.log("RUNES",context);
        
        // Iterate through items, allocating to containers
        for (let i of context.system.runes.runes) {
            //i.img = i.img || DEFAULT_TOKEN;
            runes.push(i);
        }
        
        // Assign and return
        context.runes = runes;
        
    }
    
    
    /* -------------------------------------------- */
    
    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        
        // Everything below here is only needed if the sheet is editable
        if (!this.isEditable) return;

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
        


        
        html.find('.rollable').click(this._onRoll.bind(this));
        // Roll handlers, click handlers, etc. would go here.
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
            img: CONFIG.PARALLEA.images.mageShield
        };
        // Remove the type from the dataset since it's in the itemData.type prop.
        delete itemData.system["type"];
        
        
        // Finally, create the item!
        return await Item.create(itemData, {parent: this.item});
    }

    _onRoll(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;
        
        // Handle item rolls.
        if (dataset.rollType) {
            if (dataset.rollType == 'item') {
                const itemId = element.closest('.item').dataset.itemId;
                const item = this.actor.items.get(itemId);
                if (item) return item.roll();
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
    
}
