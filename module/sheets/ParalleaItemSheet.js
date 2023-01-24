export default class ParalleaItemSheet extends ItemSheet{
    
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["boilerplate", "sheet", "item"],
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
        return context;
    }
    
    
    /* -------------------------------------------- */
    
    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        
        // Everything below here is only needed if the sheet is editable
        if (!this.isEditable) return;
        
        // Roll handlers, click handlers, etc. would go here.
    }
}
