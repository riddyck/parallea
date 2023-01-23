export default class ParalleaItemSheet extends ItemSheet{
    
    get template(){
        console.log(`${this.item.type}`);
        return `systems/parallea/templates/sheets/${this.item.type}-sheet.html`;
    }

    getData(){
        const context = super.getData();
        const itemData = this.item.toObject(false);
        context.system = itemData.system;
        context.flags = itemData.flags;

        //Mettre config sert dans le cas de menus déroulant par exemple
        context.config= CONFIG.PARALLEA;
        return data;
    }
}