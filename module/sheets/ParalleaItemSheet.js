export default class ParalleaItemSheet extends ItemSheet{
    
    get template(){
        console.log(`${this.item.type}`);
        return `systems/parallea/templates/sheets/${this.item.type}-sheet.html`;
    }

    getData(){
        const data = super.getData();
        data.config= CONFIG.PARALLEA;
        return data;
    }
}