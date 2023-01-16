import ParalleaItemSheet from "./module/sheets/ParalleaItemSheet.js";

Hooks.once("init", function (){
    console.log("Init du système Parallea, loué soit l'Empire");

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("parallea", ParalleaItemSheet, {makeDefault:true});
});