export class ParalleaItem extends Item {
  
  // Prepare data for the actor. Calling the super version of this executes
  // the following, in order: data reset (to clear active effects),
  // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
  // prepareDerivedData().
  
  prepareData(){
    super.prepareData();
  }
  
 
  prepareBaseData(){
    //this.system.attributs.equiped=this._equiped;
    
    /*
  if(this.system.runes) {
    const test = {
      type: "feu",
      niveau: 3
  };

  this.system.runes.runes.push(test);
  

  const test2 = {
      type: "eau",
      niveau: 4
  };
  this.system.runes.runes.push(test2);
  console.log("ICI",this);
  }*/
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
    const label = `[${item.type}] ${item.name}`;
    
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
        this._computeWeaponData();
        this.formula="d20+"+this.system.attack.value.toString();
        break;
        case 'spell':
        this._computeSpellData();
        this.formula="d20+"+this.system.attack.value.toString();
        break;
        case 'assault':
        this._computeAssaultData();
        console.log("AAAAAAAAAAAAAAAAAAh",this.system);
        this.formula="d20+"+this.system.itemAttack.toString()+"+"+this.system.attack_bonus.value.toString();
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
        this._computeWeaponData();
        this.formula=this.system.damage.dice_number.toString()+"d"+this.system.damage.dice_damage.toString();
        this.formula+="+"+this.system.damage.value.toString();
        break;
        case 'spell':
        this._computeSpellData();
        this.formula=this.system.damage.dice_number.toString()+"d"+this.system.damage.dice_damage.toString();
        this.formula+="+"+this.system.damage.bonus_multiplier.toString()+"*"+this.system.damage.value.toString();
        break;
        case 'assault':
        this._computeAssaultData();
        
        
        console.log("Heho",this.system.damage);




        this.formula=this.system.damage.weapon_dice_number.toString()+"d"+this.system.damage.weapon_dice_damage.toString();
        this.formula+="+"+this.system.itemDamage.toString();
        
        this.formula+="+"+this.system.damage_roll_bonus.dice_number.toString()+"d"+this.system.damage_roll_bonus.dice_damage.toString();
        this.formula+="+"+this.system.damage_bonus.bonus_multiplier*this.system.damage_bonus.bonus.toString();
        
        if(this.system.damage_bonus.global_multiplier!=1) this.formula=this.system.damage_bonus.global_multiplier.toString()+"*("+this.formula.toString()+")";
        break;
        default:
        this.formula="d1";
        break;
      }
    }
  }
  
  /*Compute les data d'une arme, en se basant sur le type de l'arme, puis en vérifiant si l'arme est à une ou deux mains*/

  _computeWeaponData(){
    const actorData = this.parent.system;
    const data = this.system;
    
    if(data.attributs.type == "phy"){
      data.attack.value = data.attack.base + actorData.mechanics.attack.phy.value;
      data.damage.value = actorData.mechanics.damage.phy.value;
    }
    else if(data.attributs.type == "ran"){
      data.attack.value = data.attack.base + actorData.mechanics.attack.ran.value;
      data.damage.value = actorData.mechanics.damage.ran.value;
    }
    else if(data.attributs.type == "mag"){
      data.attack.value = data.attack.base + actorData.mechanics.attack.mag.value;
      data.damage.value = actorData.mechanics.damage.mag.value;
    }
    
    if (actorData.twoWeapons==true && data.attributs.hands == 1){
      data.attack.value-=6;
      if(data.attributs.mainHand == true) data.attack.value+=2;
      if(data.special.ambidextry.value == true) data.attack.value+=2;
    }
    
  }
  
  
  
  
  _computeSpellData(){
    const actorData = this.parent.system;
    const data = this.system;
    
    if(data.attributs.type == "phy"){
      data.attack.value = data.attack.base + actorData.mechanics.attack.phy.value;
      data.damage.value = data.damage.multiplier*actorData.mechanics.damage.phy.value;
    }
    else if(data.attributs.type == "ran"){
      data.attack.value = data.attack.base + actorData.mechanics.attack.ran.value;
      data.damage.value = data.damage.multiplier*actorData.mechanics.damage.ran.value;
    }
    else if(data.attributs.type == "mag"){
      data.attack.value = data.attack.base + actorData.mechanics.attack.mag.value;
      data.damage.value = data.damage.multiplier*actorData.mechanics.damage.mag.value;
    }
  }
  
  _computeAssaultData(){
    const actorData = this.parent.system;
    const assaultData = this.system;
    var itemData = null;
    
    this.system.attack_bonus.value={};
    console.log("1",this.system);
    assaultData.attack_bonus.value=assaultData.attack_bonus.bonus;
    console.log("2",this.system);
    
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
    console.log("3",this.system);
    
    if (itemData==null){
      assaultData.attack={};
      assaultData.damage={};
      assaultData.damage.weapon_dice_number=0;
      assaultData.damage.weapon_dice_damage=0;
      assaultData.itemAttack = 0;
      assaultData.itemDamage = 0;
    }
    
    
    else {
      assaultData.attack={};
      assaultData.damage={};
      assaultData.damage.weapon_dice_number=itemData.damage.dice_number;
      assaultData.damage.weapon_dice_damage=itemData.damage.dice_damage;

      if(itemData.attributs.type == "phy"){
        assaultData.itemAttack = itemData.attack.base + actorData.mechanics.attack.phy.value;
        assaultData.itemDamage = itemData.damage.base + actorData.mechanics.damage.phy.value;
        assaultData.damage_bonus.bonus = actorData.mechanics.damage.phy.value;
      }
      else if(itemData.attributs.type == "ran"){
        assaultData.itemAttack = itemData.attack.base + actorData.mechanics.attack.ran.value;
        assaultData.itemDamage = itemData.damage.base + actorData.mechanics.damage.ran.value + assaultData.damage_bonus.bonus;
        assaultData.damage_bonus.bonus = actorData.mechanics.damage.ran.value;
      }
      else if(itemData.attributs.type == "mag"){
        assaultData.itemAttack = itemData.attack.base + actorData.mechanics.attack.mag.value;
        assaultData.itemDamage = itemData.damage.base + actorData.mechanics.damage.mag.value;
        assaultData.damage_bonus.bonus = actorData.mechanics.damage.mag.value;
      }
      
      if (actorData.twoWeapons==true && itemData.attributs.hands == 1){
        console.log("Il se passe quoi ?",itemData);
        assaultData.attack_bonus.value-=6;
        if(itemData.attributs.mainHand == true) assaultData.attack_bonus.value+=2;
        if(itemData.special.ambidextry.value == true) assaultData.attack_bonus.value+=2;
      }
      
    }
    console.log("Test",this.system);
    
  }
  
  _computeFormula(){
  }
  
}