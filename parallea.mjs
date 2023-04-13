import { PARALLEA } from "./module/config.js";

import { ParalleaActor } from "./module/documents/actor.mjs";
import { ParalleaItem } from "./module/documents/item.mjs";

import { ParalleaItemSheet }  from "./module/sheets/ParalleaItemSheet.mjs";
import { ParalleaActorSheet }  from "./module/sheets/ParalleaActorSheet.mjs";

import { preloadHandlebarsTemplates } from "./hadlebarTemplates.js";

Hooks.once("init", function (){
    
    console.log("Init du système Parallea, loué soit l'Empire");
    
    
    game.parallea = {
        ParalleaActor,
        ParalleaItem
    };
    
    
    CONFIG.PARALLEA = PARALLEA;
    
    CONFIG.Actor.documentClass = ParalleaActor;
    CONFIG.Item.documentClass = ParalleaItem;

    console.log("EEE3",CONFIG);
    
    Handlebars.registerHelper('times', function(n, block) {
        var accum = '';
        for(var i = 0; i < n; ++i) {
            block.data.index = i;
            block.data.first = i === 0;
            block.data.last = i === (n - 1);
            accum += block.fn(this);
        }
        return accum;
    });

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("parallea", ParalleaActorSheet, {makeDefault:true});
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("parallea", ParalleaItemSheet, {makeDefault:true});

    return preloadHandlebarsTemplates();
});