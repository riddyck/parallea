import * as runesFunction from './runes.mjs';



export class ParalleaItem extends Item {
  
  // Prepare data for the actor. Calling the super version of this executes
  // the following, in order: data reset (to clear active effects),
  // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
  // prepareDerivedData().
  
  prepareData(){
    super.prepareData();
  }
  
  
  prepareBaseData(){
    
    //If the item is a weapon or an armor (ie runable) then loop into the runes, and make them visible depending on the number of runes on an item
    this.system.runable = this.type == "weapon" || this.type == "armor";
    if(this.system.runable){
      
      this.system.runes.stats = {
        "attack":{
          "phy":0,
          "ran":0,
          "mag":0,
          "global":0
        },
        "damage":{
          "phy":0,
          "ran":0,
          "mag":0,
          "global":0
        },
        "defense":{
          "def":0,
          "arm":0,
          "rm":0
        },
        "ressources":{
          "hp":0,
          "mana":0
        }
      }
      
      var limit = this.system.runes.runes_number;
      for(var k = 1; k <=Math.min(limit,3); k++){
        this.system.runes.runes[k].display = true;
        this._computeRuneType(this.system.runes.stats,this.system.runes.runes[k]);
      }
    }
  }
  prepareDerivedData(){
    //this.system.attributs.equiped=this._equiped;
  }
  
  /**
  * Handle clickable rolls.
  * @param {Event} event   The originating click event
  * @private
  */
  async roll(rollCategory) {
    const item = this;
    
    // Initialize chat data.
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const rollMode = game.settings.get('core', 'rollMode');
    const label = `${item.name}`;
    
    // If there's no roll data, send a chat message.
    
    //Utile si on a une formula dans le system, mais j'ai pas forcément envie, je peux vouloir la créer moi même
    
    /*if (!this.system.formula) {
      ChatMessage.create({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
        content: item.system.description ?? 'YA PAS DE FORMULA'
      });
    }*/
    // Otherwise, create a roll and send a chat message from it.
    
    
    // Retrieve roll data.
    
    this._computeRollItem(rollCategory);
    
    // Invoke the roll and submit it to chat.
    const roll = new Roll(this.formula);
    // If you need to store the value first, uncomment the next line.
    // let result = await roll.roll({async: true});
    roll.toMessage({
      speaker: speaker,
      rollMode: rollMode,
      flavor: label,
    });
    return roll;
    
  }
  
  
  getRollWeapon(){
    const actor = this.parent;
    
  }
  
  /*Crée la formule de lancé de dé en utilisant les données de l'objet.*/
  _computeRollItem(rollCategory){
    
    if(rollCategory == "attack"){
      switch(this.type){
        case 'weapon':
        this._computeWeaponAttack();
        this.formula="d20+"+this.system.attack_formula;
        break;
        case 'spell':
        this._computeSpellAttack();
        this.formula="d20+"+this.system.attack_formula;
        break;
        case 'assault':
        this._computeAssaultData();
        this.formula="d20+"+this.system.attack_formula;
        break;
        default:
        this.formula="d1";
        break;
        
        
        /**{
          this.formulaRolling=this.formula.attack;
        }*/
        
      }
    }
    else if (rollCategory == "damage"){
      switch(this.type){
        case 'weapon':
        this._computeWeaponDamage();
        this.formula=this.system.damage_formula;
        break;
        case 'spell':
        this._computeSpellDamage();
        this.formula=this.system.damage_formula;
        break;
        case 'assault':
        this._computeAssaultData();
        
        console.log("ICI",this.system.damage);
        
        
        this.formula=this.system.damage_formula;
        break;
        default:
        this.formula="d1";
        break;
      }
    }
  }
  
  /*Compute les data d'une arme, en se basant sur le type de l'arme, puis en vérifiant si l'arme est à une ou deux mains*/
  
  _computeWeaponAttack(){
    const actorData = this.parent.system;
    
    let stance = this._noStance();
    if (actorData.selectedStance!='0'){ 
      stance = this.parent.collections.items.get(actorData.selectedStance).system;
    }
    
    const data = this.system;
    const rune = data.runes.stats;
    
    let ambidextry = 0;
    if (actorData.twoWeapons==true && data.attributs.hands == 1){
      ambidextry-=6;
      if(data.attributs.mainHand == true) ambidextry+=2;
      if(data.special.ambidextry.value == true) ambidextry+=2;
    }
    
    let attack_formula = "";
    {
      attack_formula+=data.attack.base.toString();
      attack_formula+="+"+actorData.mechanics.attack[data.attributs.type].value.toString();
      attack_formula+="+"+(stance.attack[data.attributs.type].value+stance.attack.global.value).toString();
      if(rune.attack.global!=0)attack_formula+="+"+rune.attack.global.toString();
      if(ambidextry!=0) attack_formula+="+"+ambidextry.toString();
    }
    data.attack_formula = attack_formula;
  }
  
  _computeWeaponDamage(){
    const actorData = this.parent.system;
    
    let stance = this._noStance();
    if (actorData.selectedStance!='0'){ 
      stance = this.parent.collections.items.get(actorData.selectedStance).system;
    }
    
    
    let damage_formula = this.system.damage.dice_number.toString()+"d"+this.system.damage.dice_damage.toString();
    
    const data = this.system;
    const rune = data.runes.stats;
    
    {
      if(data.damage.base!=0)damage_formula+="+"+data.damage.base.toString();
      damage_formula+="+"+actorData.mechanics.damage[data.attributs.type].value.toString();
      damage_formula+="+"+(stance.damage[data.attributs.type].value+stance.damage.global.value).toString();
      if(rune.damage.global!=0)damage_formula+="+"+rune.damage.global.toString();
    }
    data.damage_formula = damage_formula;
  }
  
  
  _computeSpellAttack(){
    const actorData = this.parent.system;
    
    let stance = this._noStance();
    if (actorData.selectedStance!='0'){ 
      stance = this.parent.collections.items.get(actorData.selectedStance).system;
    }
    
    const data = this.system;
    
    data.attack.value = stance.attack[data.attributs.type].value + stance.attack.global.value;
    
    let attack_formula = "";
    {
      attack_formula+=data.attack.base.toString();
      attack_formula+="+"+actorData.mechanics.attack[data.attributs.type].value.toString();
      attack_formula+="+"+(stance.attack[data.attributs.type].value + stance.attack.global.value).toString();
    }
    data.attack_formula = attack_formula;
    
  }
  
  
  
  _computeSpellDamage(){
    const actorData = this.parent.system;
    
    let stance = this._noStance();
    if (actorData.selectedStance!='0'){ 
      stance = this.parent.collections.items.get(actorData.selectedStance).system;
    }
    
    let damage_formula = this.system.damage.dice_number.toString()+"d"+this.system.damage.dice_damage.toString();
    damage_formula+="+"+this.system.damage.bonus_multiplier.toString()+"*";
    
    const data = this.system; 
    {
      damage_formula+=actorData.mechanics.damage[data.attributs.type].value.toString();
      damage_formula+="+"+(stance.damage[data.attributs.type].value+stance.damage.global.value).toString();
    }
    data.damage_formula = damage_formula;
    
  }
  
  _computeAssaultData(){
    const actorData = this.parent.system;
    
    let stance = this._noStance();
    if (actorData.selectedStance!='0'){ 
      stance = this.parent.collections.items.get(actorData.selectedStance).system;
    }
    
    const assaultData = this.system;
    var itemData = null;
    
    this.system.attack_bonus.value={};
    assaultData.attack_bonus.value=assaultData.attack_bonus.bonus;
    
    for (let key of Object.keys(actorData.equipment)) {
      if (actorData.equipment[key]){
        var item = this.parent.items.get(key);
        if(item.type == 'weapon'){
          if(item.system.attributs.mainHand){
            itemData = item.system;
            break;
          }
        }
      }
    }
    
    let attack_formula = "";
    let damage_formula ="";
    
    if (itemData==null){
      assaultData.damage={
        weapon_dice_number:0,
        weapon_dice_damage:0
      };
      assaultData.damage.weapon_dice_number=0;
      assaultData.damage.weapon_dice_damage=0;
      assaultData.itemAttack = 0;
      assaultData.itemDamage = 0;
      
      attack_formula ="0";
      damage_formula ="d0";
    }
    else {
      const rune = itemData.runes.stats;
      
      assaultData.damage={
        weapon_dice_number:itemData.damage.dice_number,
        weapon_dice_damage:itemData.damage.dice_damage,
        damage_value:0
      };
      
      assaultData.itemAttack = itemData.attack.base + actorData.mechanics.attack[itemData.attributs.type].value;
      assaultData.itemDamage = itemData.damage.base + actorData.mechanics.damage[itemData.attributs.type].value;
      assaultData.damage.damage_value = actorData.mechanics.damage[itemData.attributs.type].value;
      
      let ambidextry = 0;
      if (actorData.twoWeapons==true && itemData.attributs.hands == 1){
        ambidextry-=6;
        if(itemData.attributs.mainHand == true) ambidextry+=2;
        if(itemData.special.ambidextry.value == true) ambidextry+=2;
      }
      
      assaultData.attack_bonus.value+=ambidextry;
      
      
      assaultData.attack_bonus.value += stance.attack[itemData.attributs.type].value + stance.attack.global.value
      assaultData.damage.damage_value += stance.damage[itemData.attributs.type].value + stance.damage.global.value
      
      
      
      attack_formula +=itemData.attack.base.toString();
      attack_formula +="+"+actorData.mechanics.attack[itemData.attributs.type].value.toString();
      attack_formula +="+"+(stance.attack[itemData.attributs.type].value + stance.attack.global.value).toString();
      if(ambidextry!=0)attack_formula +="+"+ambidextry.toString();
      if(rune.attack.global!=0)attack_formula+="+"+rune.attack.global.toString();
      
      
      
      
      
      
      assaultData.attack_formula=attack_formula;
      console.log(assaultData);
      
      if (assaultData.damage_bonus.global_multiplier!=1)damage_formula+=assaultData.damage_bonus.global_multiplier.toString()+"*(";
      
      damage_formula += itemData.damage.dice_number.toString()+"d"+itemData.damage.dice_damage.toString();
      damage_formula += "+"+itemData.damage.base.toString();
      damage_formula += "+"+actorData.mechanics.damage[itemData.attributs.type].value.toString();
      if(rune.damage.global!=0)damage_formula+="+"+rune.damage.global.toString();
      
      damage_formula+="+"+assaultData.damage_roll_bonus.dice_number.toString()+"d"+assaultData.damage_roll_bonus.dice_damage.toString();
      damage_formula+="+"+assaultData.damage_bonus.bonus_multiplier*assaultData.damage_bonus.bonus.toString();
      damage_formula+="+"+actorData.mechanics.damage[itemData.attributs.type].value.toString();
      damage_formula+="+"+(stance.damage[itemData.attributs.type].value + stance.damage.global.value).toString();
      
      
      if (assaultData.damage_bonus.global_multiplier!=1)damage_formula+=")";
      console.log("Damage formula",damage_formula);
      assaultData.damage_formula=damage_formula;
      
    }
    
  }
  
  _computeRuneType(stats,rune){
    switch (rune.type){
      case 'edge':
      runesFunction.edgePrep(stats,rune);
      break;
      case 'power':
      runesFunction.powerPrep(stats,rune);
      break;
      case 'hardness':
      runesFunction.hardnessPrep(stats,rune);
      break;
      case 'fire':
      runesFunction.firePrep(stats,rune);
      break;
      
      case 'resistance':
      runesFunction.resistancePrep(stats,rune);
      break;
      case 'protection':
      runesFunction.protectionPrep(stats,rune);
      break;
      case 'reinforce':
      runesFunction.reinforcePrep(stats,rune);
      break;
      
      case 'mana':
      runesFunction.manaPrep(stats,rune);
      break;
      case 'magicPower':
      runesFunction.magicPowerPrep(stats,rune);
      break;
      case 'magicFocus':
      runesFunction.magicFocusPrep(stats,rune);
      break;
      case 'magicOvercharge':
      runesFunction.magicOverchagePrep(stats,rune);
      break;
      
      case 'light':
      runesFunction.lightPrep(stats,rune);
      break;
      default:
      break;
    }
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