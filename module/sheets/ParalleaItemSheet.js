export default class ParalleaItemSheet extends ItemSheet{
    
    get template(){
        return `systems/parallea/templates/sheets/${this.item.type}-sheet.html`;
    }
}