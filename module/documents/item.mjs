export class ParalleaItem extends Item {
  
  // Prepare data for the actor. Calling the super version of this executes
  // the following, in order: data reset (to clear active effects),
  // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
  // prepareDerivedData().
  
  prepareData(){
    super.prepareData();
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
  
  _computeRollItem(rollCategory){
    if(rollCategory == "attack"){
      switch(this.type){
        case 'weapon':
        this._computeWeaponData();
        this.formula="d20+"+this.system.attack.value.toString();
        break;
        case 'armor':
        this._computeArmorData();
        this.formula="d20+"+this.system.attack.value.toString();
        break;
        case 'spell':
        this._computeSpellData();
        this.formula="d20+"+this.system.attack.value.toString();
        break;
        case 'skill':
        this._computeSkillData();
        this.formula="d20+"+this.system.attack.value.toString();
        break;
        default:
        this.formula="d1";
        break;
      }
    }
    else if (rollCategory == "damage"){
      switch(this.type){
        case 'weapon':
        this._computeWeaponData();
        this.formula="d"+this.system.damage.dice_damage.toString()+"+"+this.system.damage.value.toString();
        break;
        case 'armor':
        this._computeArmorData();
        this.formula="d20+"+this.system.attack.value.toString();
        break;
        case 'spell':
        this._computeSpellData();
        this.formula="d"+this.system.damage.dice_damage.toString()+"+"+this.system.damage.value.toString();
        break;
        case 'skill':
        this._computeSkillData();
        this.formula="d20+"+this.system.attack.value.toString();
        break;
        default:
        this.formula="d1";
        break;
      }
    }
  }
  
  
  _computeWeaponData(){
    const actorData = this.parent.system;
    const data = this.system;
    
    if(data.attributs.type == "phy"){
      data.attack.value = data.attack.base + actorData.mechanics.attack.phy.value;
      data.damage.value = data.damage.base + actorData.mechanics.damage.phy.value;
    }
    else if(data.attributs.type == "ran"){
      data.attack.value = data.attack.base + actorData.mechanics.attack.ran.value;
      data.damage.value = data.damage.base + actorData.mechanics.damage.ran.value;
    }
    else if(data.attributs.type == "mag"){
      data.attack.value = data.attack.base + actorData.mechanics.attack.mag.value;
      data.damage.value = data.damage.base + actorData.mechanics.damage.mag.value;
    }
  }
  
  
  
  
  
  _computeArmorData(){}
  
  
  _computeSpellData(){
    const actorData = this.parent.system;
    const data = this.system;
    
    if(data.attributs.type == "phy"){
      data.attack.value = data.attack.base + actorData.mechanics.attack.phy.value;
      data.damage.value = data.damage.base + data.damage.multiplier*actorData.mechanics.damage.phy.value;
    }
    else if(data.attributs.type == "ran"){
      data.attack.value = data.attack.base + actorData.mechanics.attack.ran.value;
      data.damage.value = data.damage.base + data.damage.multiplier*actorData.mechanics.damage.ran.value;
    }
    else if(data.attributs.type == "mag"){
      data.attack.value = data.attack.base + actorData.mechanics.attack.mag.value;
      data.damage.value = data.damage.base + data.damage.multiplier*actorData.mechanics.damage.mag.value;
    }
  }
  
  
  _computeSkillData(){}

}