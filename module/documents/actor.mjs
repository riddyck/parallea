export class ParalleaActor extends Actor {
  
  // Prepare data for the actor. Calling the super version of this executes
  // the following, in order: data reset (to clear active effects),
  // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
  // prepareDerivedData().
  
  prepareData(){
    super.prepareData();
    console.log("Actor Parallea",this);
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

    this._computeMechanicsDefense(systemData);
    this._computeMechanicsRessources(systemData);
    this._computeMechanicsAttack(systemData);
    
    
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
  
  _computeMechanicsDefense(systemData){
    const attributs = systemData.attributs;
    const mechanics = systemData.mechanics;
    const progression = systemData.progression;
    
    //---Calculating mechanics.defense----
    
    const defense = mechanics.defense;
    
    defense.def.value = Math.floor(attributs.dex.value/5) + progression.defense.def_investment.value + defense.def.armor + defense.def.bonus; 
    defense.arm.value = Math.floor((attributs.str.value-50)/5) + 2*progression.defense.arm_investment.value + defense.arm.armor + defense.arm.armor
    defense.mr.value = Math.floor((attributs.int.value-50)/5) + 2*progression.defense.mr_investment.value + defense.mr.armor + defense.mr.armor
  }
  _computeMechanicsRessources(systemData){
    const mechanics = systemData.mechanics;
    const progression = systemData.progression;
    
    //---Calculating mechanics.ressources----
    
    const ress = mechanics.ressources;
    
    ress.hp.value = ress.hp.base + progression.ressources.hp_up.value + progression.ressources.hp_up.special; 
    ress.mana.value = ress.mana.base + progression.ressources.mana_up.value + progression.ressources.mana_up.special;
    ress.ressource.value = ress.ressource.base + progression.ressources.ressource_up.value + progression.ressources.ressource_up.special;
    
  }
  _computeMechanicsAttack(systemData){
    const attributs = systemData.attributs;
    const mechanics = systemData.mechanics;
    const progression = systemData.progression;
    
    //---Calculating mechanics.attack----
    
    const atk = mechanics.attack;
    
    atk.phy.base =  Math.max(Math.floor((attributs.str.value-50)/10),Math.floor((attributs.dex.value-50)/10));
    atk.ran.base =  Math.floor((attributs.dex.value-50)/10);
    atk.mag.base =  Math.floor((attributs.int.value-50)/10);
    
    mechanics.damage.phy.base =  Math.max(Math.floor((attributs.str.value-50)/10),0);
    mechanics.damage.ran.base =  Math.max(Math.floor((attributs.dex.value-50)/10),0);
    mechanics.damage.mag.base =  Math.max(Math.floor((attributs.int.value-50)/10),0);
    
    atk.phy.value = atk.phy.base + atk.phy.bonus + atk.phy.armor + progression.attack.physic_investment.value;
    atk.ran.value = atk.ran.base + atk.ran.bonus + atk.ran.armor + progression.attack.range_investment.value;
    atk.mag.value = atk.mag.base + atk.mag.bonus + atk.mag.armor + progression.attack.magic_investment.value;
  }
  
  
  
  
  
  
  
  
}