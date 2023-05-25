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
    const iterItem = this.items.keys();
    const itemKeys=[];
    var k = iterItem.next();
    while(!k.done){
      itemKeys.push(k.value);
      k = iterItem.next();
    }
    for (let key of Object.keys(this.system.equipment)) if (!(itemKeys.includes(key))) delete this.system.equipment[key];
    
    //console.log("This",this);
    
    this.system.stances={"0":"Pas de posture"};
    
    for (let item of this.collections.items.entries()){
      if(item[1].type=="stance"){
        this.system.stances[item[0]]=item[1].name;
      }
    }
    
    //delete this.system.equipment['0'] ;
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
    systemData.chargeForm=false;
    
    for(let [key, attribut] of Object.entries(systemData.attributs)){
      attribut.mod = Math.floor(attribut.value/10-5);
    }
    
    this._computeMechanicsDefense(systemData);
    this._computeMechanicsRessources(systemData);
    this._computeMechanicsAttack(systemData);
    this._computeMechanicsDamage(systemData);
    
    this.system.twoWeapons = false;
    
    var wCount = 0;
    
    for (let key of Object.keys(systemData.equipment)) {
      if (systemData.equipment[key] && this.items.get(key).type=='weapon'){
        if(!this.items.get(key).system.special.no_2w_malus.value & this.items.get(key).system.attributs.hands==1) wCount++;
      }
    }
    if(wCount>1) this.system.twoWeapons = true;
    
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
    
    var gear = this._computeGearDefense(systemData);
    
    const defense = mechanics.defense;
    
    
    let stance = this._noStance().defense;
    if (this.system.selectedStance!='0' && this.system.selectedStance!='') stance = this.collections.items.get(this.system.selectedStance).system.defense;
    
    
    
    defense.def.value = Math.floor(attributs.dex.value/10) + Math.floor(attributs.wis.value/10) + progression.defense.def_investment.value + defense.def.bonus + gear[0] + stance.def.value; 
    defense.arm.value = Math.floor((attributs.str.value-50)/5) + 2*progression.defense.arm_investment.value + defense.arm.bonus + gear[1] + stance.arm.value;
    defense.mr.value = Math.floor((attributs.arc.value-50)/5) + 2*progression.defense.mr_investment.value + defense.mr.bonus + gear[2] + stance.mr.value;
    


    /*
    defense.def.value = Math.floor(attributs.dex.value/5) + progression.defense.arm_investment.value + progression.defense.mr_investment.value + defense.def.bonus + gear[0]; 
    defense.arm.value = Math.floor((attributs.str.value-50)/5) + progression.defense.arm_investment.value + defense.arm.bonus + gear[1];
    defense.mr.value = Math.floor((attributs.arc.value-50)/5) + progression.defense.mr_investment.value + defense.mr.bonus + gear[2];
    */
    
  }
  _computeMechanicsRessources(systemData){
    const attributs = systemData.attributs;
    const mechanics = systemData.mechanics;
    const progression = systemData.progression;
    
    //---Calculating mechanics.ressources----
    
    const ress = mechanics.ressources;
    
    var gear = this._computeGearRessource(systemData);
    
    ress.hp.value = ress.hp.base + progression.ressources.hp_up.value + progression.ressources.hp_up.special + gear[0]; 
    ress.mana.value = ress.mana.base + Math.max(Math.floor((attributs.arc.value-60)/10),0) + progression.ressources.mana_up.value + progression.ressources.mana_up.special + gear[1];
    ress.ressource.value = ress.ressource.base + progression.ressources.ressource_up.value + progression.ressources.ressource_up.special;
    ress.tena.value = ress.tena.base + Math.max(Math.floor((attributs.str.value-60)/10),0) + gear[2];
    (ress.tena.value>0) ? ress.tena.display = true : ress.tena.display = false;
  }
  _computeMechanicsAttack(systemData){
    const attributs = systemData.attributs;
    const mechanics = systemData.mechanics;
    const progression = systemData.progression;
    
    //---Calculating mechanics.attack----
    
    var gear = this._computeGearAttack(systemData);
    
    const atk = mechanics.attack;
    
    atk.phy.base =  Math.floor((attributs.dex.value-50)/10);
    atk.ran.base =  Math.floor((attributs.dex.value-50)/10);
    atk.mag.base =  Math.floor((attributs.wis.value-50)/10);
    
    atk.phy.value = atk.phy.base + atk.phy.bonus + atk.phy.armor + progression.attack.physic_investment.value + gear[0];
    atk.ran.value = atk.ran.base + atk.ran.bonus + atk.ran.armor + progression.attack.range_investment.value + gear[1];
    atk.mag.value = atk.mag.base + atk.mag.bonus + atk.mag.armor + progression.attack.magic_investment.value + gear[2];
  }
  
  
  _computeMechanicsDamage(systemData){
    const attributs = systemData.attributs;
    const mechanics = systemData.mechanics;
    const progression = systemData.progression;
    
    //---Calculating mechanics.attack----
    
    const dmg = mechanics.damage;
    
    var gear = this._computeGearDamage(systemData);
    
    dmg.phy.base =  Math.max(Math.floor((attributs.str.value-50)/10),0);
    //dmg.ran.base =  Math.max(Math.floor((attributs.dex.value-50)/10),0);
    dmg.mag.base =  Math.max(Math.floor((attributs.arc.value-50)/10),0);
    
    dmg.phy.value = dmg.phy.base + dmg.phy.bonus + progression.attack.physic_investment.value + gear[0];
    dmg.ran.value = dmg.ran.bonus + progression.attack.range_investment.value + gear[1];
    dmg.mag.value = dmg.mag.base + dmg.mag.bonus + progression.attack.magic_investment.value + gear[2];
  }
  
  _computeGearAttack(systemData){
    var gear_phy = 0;
    var gear_ran = 0;
    var gear_mag = 0;
    
    let source = this.collections.items._source;
    
    for (let key of Object.keys(this.collections.items._source)) {
      if(source[key].type=="skill"){
        gear_phy += source[key].system.mechanics.attack.phy.value;
        gear_ran += source[key].system.mechanics.attack.ran.value;
        gear_mag += source[key].system.mechanics.attack.mag.value;
      }
    }
    
    for (let key of Object.keys(systemData.equipment)) {
      if (systemData.equipment[key]){
        const item = this.items.get(key);
        const itemAttack = item.system.attack;
        const itemRunes = item.system.runes.stats;
        if(item.type=='armor'){
          gear_phy+=itemAttack.phy.base + itemAttack.global.base + itemRunes.attack.phy;
          gear_ran+=itemAttack.ran.base + itemAttack.global.base + itemRunes.attack.ran;
          gear_mag+=itemAttack.mag.base + itemAttack.global.base + itemRunes.attack.mag;
        }
        else if(item.type=='weapon'){
          gear_phy+=itemAttack.phy.bonus + itemRunes.attack.phy;;
          gear_ran+=itemAttack.ran.bonus + itemRunes.attack.ran;
          gear_mag+=itemAttack.mag.bonus + itemRunes.attack.mag;
        }
      }
    }
    return([gear_phy,gear_ran,gear_mag]);
  }
  
  _computeGearDamage(systemData){
    var gear_phy = 0;
    var gear_ran = 0;
    var gear_mag = 0;
    

    let source = this.collections.items._source;
    
    for (let key of Object.keys(this.collections.items._source)) {
      if(source[key].type=="skill"){
        gear_phy += source[key].system.mechanics.damage.phy.value;
        gear_ran += source[key].system.mechanics.damage.ran.value;
        gear_mag += source[key].system.mechanics.damage.mag.value;
      }
    }

    for (let key of Object.keys(systemData.equipment)) {
      if (systemData.equipment[key]){
        const item = this.items.get(key);
        const itemRunes = item.system.runes.stats;
        gear_phy+=itemRunes.damage.phy;
        gear_ran+=itemRunes.damage.ran;
        gear_mag+=itemRunes.damage.mag;
        
      }
    }
    return([gear_phy,gear_ran,gear_mag]);
  }
  
  _computeGearDefense(systemData){
    var gear_def = 0;
    var gear_arm = 0;
    var gear_mr = 0;
    
    let source = this.collections.items._source;
    
    for (let key of Object.keys(this.collections.items._source)) {
      if(source[key].type=="skill"){
        gear_def += source[key].system.mechanics.defense.def.value;
        gear_arm += source[key].system.mechanics.defense.arm.value;
        gear_mr += source[key].system.mechanics.defense.mr.value;
      }
    }

    for (let key of Object.keys(systemData.equipment)) {
      if (systemData.equipment[key]){
        gear_def+=this.items.get(key).system.defense.base;
        if(this.items.get(key).type=='armor'){
          gear_arm+=this.items.get(key).system.arm.base;
          gear_mr+=this.items.get(key).system.mr.base;
        }
      }
    }
    return([gear_def,gear_arm,gear_mr]);
  }
  
  _computeGearRessource(systemData){
    var gear_hp = 0;
    var gear_mana = 0;
    var gear_tena = 0;

    
    let source = this.collections.items._source;
    
    for (let key of Object.keys(this.collections.items._source)) {
      if(source[key].type=="skill"){
        gear_hp += source[key].system.mechanics.ressources.hp.value;
        gear_mana += source[key].system.mechanics.ressources.mana.value;
        gear_tena += source[key].system.mechanics.ressources.tena.value;
      }
    }
    
    for (let key of Object.keys(systemData.equipment)) {
      if (systemData.equipment[key]){
        if(this.items.get(key).type=='armor'){
          const item = this.items.get(key);
          const itemRunes = item.system.runes.stats;
          gear_hp+=itemRunes.ressources.hp;
          gear_mana+=itemRunes.ressources.mana;
        }
      }
    }
    return([gear_hp,gear_mana,gear_tena]);
  }

  _computeStanceAttribut(rollAtt){
    if (this.system.selectedStance=='0') return 0;
    let stance = this.collections.items.get(this.system.selectedStance).system.characteristics;
    return (stance.global.value+stance[rollAtt].value);
  }
  
  async _rollAttribut(rollAtt) {
    const actor = this;
    const speaker = ChatMessage.getSpeaker({ actor: this });
    const rollMode = game.settings.get('core', 'rollMode');
    const label = `Jet de ${actor.system.attributs[rollAtt].label}`;
    const stanceBonus = this._computeStanceAttribut(rollAtt);
    let formula = 'd100<'+(actor.system.attributs[rollAtt].value+stanceBonus).toString();
    const roll = new Roll(formula);
    roll.toMessage({
      speaker: speaker,
      rollMode: rollMode,
      flavor: label,
    });
    return roll;
  }
  
  _noStance(){
    let stance = {
      defense:{
        def:{
          value:0
        },
        arm:{
          value:0,
        },
        mr:{
          value:0,
        }
      },
      
      attack:{
        global:{
          value:0,
        },
        phy:{
          value:0,
        },
        ran:{
          value:0,
        },
        mag:{
          value:0,
        }
      },
      
      damage:{
        global:{
          value:0,
        },
        phy:{
          value:0,
        },
        ran:{
          value:0,
        },
        mag:{
          value:0,
        }
      }
    }
    return stance;
  }
}