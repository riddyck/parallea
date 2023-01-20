import { PARALLEA } from "./module/config.js";
import ParalleaItemSheet from "./module/sheets/ParalleaItemSheet.js";

Hooks.once("init", function (){
    console.log("Init du système Parallea, loué soit l'Empire");

    CONFIG.PARALLEA = PARALLEA;
    console.log(PARALLEA);
    console.log(CONFIG.PARALLEA);

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("parallea", ParalleaItemSheet, {makeDefault:true});
});