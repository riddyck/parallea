export default class ParalleaActorSheet extends ActorSheet{

    get template(){
        //console.log(`${this.actor.type}`);
        return `systems/parallea/templates/sheets/${this.actor.type}-sheet.html`
    }

    getData(){
        const data = super.getData();
        data.config = CONFIG.PARALLEA;
        return data;
    }
}
