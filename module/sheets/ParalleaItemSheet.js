export default class ParalleaItemSheet extends ItemSheet{
    
    get template(){
        return `systems/parallea/templates/sheets/${this.item.type}-sheet.html`;
    }

    getData(){
        const data = super.getData();
        console.log("-------------J'AI GET DATA----------------");
        data.config= CONFIG.PARALLEA;
        console.log(CONFIG.PARALLEA);
        console.log(data);
        return data;
    }
}