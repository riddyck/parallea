import { PARALLEA } from "./module/config.js";
import ParalleaItemSheet from "./module/sheets/ParalleaItemSheet.js";
import ParalleaActorSheet from "./module/sheets/ParalleaActorSheet.js";
import ParalleaActor from "./module/documents/Actor.js";
import { preloadHandlebarsTemplates } from "./hadlebarTemplates.js";

Hooks.once("init", function (){
    console.log("Init du système Parallea, loué soit l'Empire");

    CONFIG.PARALLEA = PARALLEA;

    CONFIG.Actor.documetClass = ParalleaActor;
    //CONFIG.Item.documetClass = ParalleaItem;

    preloadHandlebarsTemplates();

    //Items.unregisterSheet("core", ItemSheet);
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("parallea", ParalleaItemSheet, {makeDefault:true});

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("parallea", ParalleaActorSheet, {makeDefault:true});
});