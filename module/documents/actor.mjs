export class ParalleaActor extends Actor {
  
  // Prepare data for the actor. Calling the super version of this executes
  // the following, in order: data reset (to clear active effects),
  // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
  // prepareDerivedData().
  
  prepareData(){
    super.prepareData();
  }
  
  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
  }
  
  /**
  * @override
  * Augment the basic actor data with additional dynamic data. Typically,
  * you'll want to handle most of your calculated/derived data in this step.
  * Data calculated in this step should generally not exist in template.json
  * (such as ability modifiers rather than ability scores) and should be
  * available both inside and outside of character sheets (such as if an actor
  * is queried and has a roll executed directly from it).
  */
  prepareDerivedData(){
    const actorData = this;
    const systemData = actorData.system;
    const flags = actorData.flags.parallea || {};
    
    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._preparePlayerData(actorData);
  }
  
  
  _preparePlayerData(actorData) {
    if (actorData.type != 'player') {
      return;
    }
    const systemData = actorData.system;
  
    for(let [key, attribut] of Object.entries(systemData.attributs)){
      attribut.mod = Math.floor(attribut.value/10-5);
    }

    const attributs = systemData.attributs;
    const mechanics = systemData.mechanics;
    const progression = systemData.progression;

    //---Calculating mechanics.defense----

    mechanics.defense.def.value = Math.floor(attributs.dex.value/5) + progression.defense.def_investment.value ; 
    mechanics.defense.arm.value = Math.floor(attributs.str.value/5)-10; 
    mechanics.defense.mr.value = Math.floor(attributs.int.value/5)-10; 

    //---Calculating mechanics.ressources----

    mechanics.ressources.hp.value = mechanics.ressources.hp.base + progression.ressources.hp_up.value + progression.ressources.hp_up.special; 
    mechanics.ressources.mana.value = mechanics.ressources.mana.base + progression.ressources.mana_up.value + progression.ressources.mana_up.special;
    mechanics.ressources.ressource.value = mechanics.ressources.ressource.base + progression.ressources.ressource_up.value + progression.ressources.ressource_up.special;
    
  }
  
  /**
  * Override getRollData() that's supplied to rolls.
  */
  getRollData() {
    const data = super.getRollData();

    //console.log("Data actor ", data);
    
    // Prepare character roll data.
    this._getPlayerRollData(data);
    this._getNpcRollData(data);
    
    return data;
  }
  
  /**
  * Prepare character roll data.
  * Cette méthode sert à rendre accessible certaines données dans Data, ou à 
  * calculer des données qui pourraient servir aux rolls.
  * 
  */
  _getPlayerRollData(data) {
    if (this.type !== 'player') return;
    
    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    
    
    if (data.attributs) {
      
      
    }
  }
  
  /**
  * Prepare NPC roll data.
  */
  _getNpcRollData(data) {
    if (this.type !== 'npc') return;
    
    // Process additional NPC data here.
  }
}