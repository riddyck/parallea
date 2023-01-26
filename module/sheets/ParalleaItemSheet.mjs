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
        console.log(`${this.item.type}`);
        return `systems/parallea/templates/sheets/${this.item.type}-sheet.html`;
    }
    
    
    
    getData(){
        const context = super.getData();
        const itemData = this.item.toObject(false);

        context.system = itemData.system;
        context.flags = itemData.flags;
        
        console.log(this);
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

        return context;
    }
    
    
    /* -------------------------------------------- */
    
    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        
        // Everything below here is only needed if the sheet is editable
        if (!this.isEditable) return;
        
        html.find('.rollable').click(this._onRoll.bind(this));
        // Roll handlers, click handlers, etc. would go here.
    }

    _onRoll(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;
        
        console.log(dataset);
        // Handle item rolls.
        if (dataset.rollType) {
            console.log(dataset.rollType);
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
            console.log(roll.toMessage);
            return roll;
        }
    }
    
}
