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
  }
  
  /**
  * Override getRollData() that's supplied to rolls.
  */
  getRollData() {
    const data = super.getRollData();
    
    // Prepare character roll data.
    this._getCharacterRollData(data);
    this._getNpcRollData(data);
    
    return data;
  }
  
  /**
  * Prepare character roll data.
  */
  _getCharacterRollData(data) {
    if (this.type !== 'character') return;
    
    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (data.abilities) {
      for (let [k, v] of Object.entries(data.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
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