import { PARALLEA } from "./module/config.js";

import { ParalleaActor } from "./module/documents/actor.mjs";
import { ParalleaItem } from "./module/documents/item.mjs";

import { ParalleaItemSheet }  from "./module/sheets/ParalleaItemSheet.mjs";
import { ParalleaActorSheet }  from "./module/sheets/ParalleaActorSheet.mjs";

import { preloadHandlebarsTemplates } from "./hadlebarTemplates.js";

Hooks.once("init", function (){
    
    console.log("Init du système Parallea, loué soit l'Empire");
    
    
    game.parallea = {
        ParalleaActor
    };
    
    
    CONFIG.PARALLEA = PARALLEA;
    
    CONFIG.Actor.documentClass = ParalleaActor;
    CONFIG.Item.documetClass = ParalleaItem;
    
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("parallea", ParalleaItemSheet, {makeDefault:true});
    
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("parallea", ParalleaActorSheet, {makeDefault:true});

    return preloadHandlebarsTemplates();
});