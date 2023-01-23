export default class ParalleaActorSheet extends ActorSheet{
    
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
        console.log(context.actor);
        const actorData = this.actor.toObject(false);
        console.log(actorData);
        
        context.system = actorData.system;
        context.flags = actorData.flags;
        
        
        // Prepare character data and items.
        if (actorData.type == 'character') {
            //this._prepareItems(context);
            //this._prepareCharacterData(context);
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
        const gear = [];
        const features = [];
        const spells = [];
        /*
        // Iterate through items, allocating to containers
        for (let i of context.items) {
            i.img = i.img || DEFAULT_TOKEN;
            // Append to gear.
            if (i.type === 'item') {
                gear.push(i);
            }
            // Append to features.
            else if (i.type === 'feature') {
                features.push(i);
            }
            // Append to spells.
            else if (i.type === 'spell') {
                if (i.data.spellLevel != undefined) {
                    spells[i.data.spellLevel].push(i);
                }
            }
        }*/
    }
    
    // Assign and return
    //context.gear = gear;
    //context.features = features;
    //context.spells = spells;
    
}
