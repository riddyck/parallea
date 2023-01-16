export default class ParalleaItemSheet extends ItemSheet{
    get template(){
        return 'systems/parallea_fiche_foundry/templates/sheets/${this.item.data.types}-sheet.html';
    }
}