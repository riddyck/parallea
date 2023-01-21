export default class ParalleaActorSheet extends ActorSheet{
    getTemplate(){
        return `systems/module/sheets/${this.item.type}-sheet.html`
    }

    getData(){
        const data = super.getData();
        data.config = CONFIG.PARALLEA;
        return data;
    }
}
