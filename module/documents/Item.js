export default class ParalleaItem extends Item {
  
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    
    prepareData(){
      super.prepareData();
      // Get the Item's data
      const itemData = this.data;
      const actorData = this.actor ? this.actor.data : {};
      const data = itemData.data;
    }
    
}