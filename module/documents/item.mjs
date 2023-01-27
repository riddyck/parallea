export class ParalleaItem extends Item {
  
  // Prepare data for the actor. Calling the super version of this executes
  // the following, in order: data reset (to clear active effects),
  // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
  // prepareDerivedData().
  
  prepareData(){
    super.prepareData();
    console.log("Item Parallea",this);
  }
  
  
  prepareDerivedData(){
  }
  
  getRollData() {
    // If present, return the actor's roll data.
    //if ( !this.actor ) return null;
    //const rollData = this.actor.getRollData();
    // Grab the item's system data as well.
    const rollData = {};
    rollData.item = foundry.utils.deepClone(this.system);
    
    if(this.system.type = "weapon"){
      this._computeWeaponData();
      rollData.item.formula = "d20+"+this.system.attack.value.toString();
    }
    else{
      rollData.item.formula = "d1";
    }
    return rollData;
  }
  
  /**
  * Handle clickable rolls.
  * @param {Event} event   The originating click event
  * @private
  */
  async roll() {
    const item = this;
    
    console.log("On est entré dans le roll depuis l'item !", this.parent.system);
    
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
    const rollData = this.getRollData();
    
    // Invoke the roll and submit it to chat.
    const roll = new Roll(rollData.item.formula, rollData);
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
  
  
  _computeWeaponData(){
    const actorData = this.parent.system;
    const data = this.system;
    
    if(data.attributs.type = "phy"){
      data.attack.value = data.attack.base + actorData.mechanics.attack.phy.value;
    }
    else if(data.attributs.type = "ran"){
      data.attack.value = data.attack.base + actorData.mechanics.attack.ran.value;
    }
    else if(data.attributs.type = "mag"){
      data.attack.value = data.attack.base + actorData.mechanics.attack.mag.value;
    }
  }
  
}