export function firePrep(stats,rune) {
    stats.attack.phy+=1*rune.level;
    stats.damage.global+=1*rune.level;
}

export function edgePrep(stats,rune) {
    stats.damage.global+=1*rune.level;
}

//Est-ce posssible d'avoir une rune sur une arme qui donne de l'attaque à autre chose que cette arme ?

/*Caractéristiques affectées par les runes

    var rune={
        "attack":{
            "phy":0,
            "ran":0,
            "mag":0,
            "global":0
        },
        "damage":{
            "phy":0,
            "ran":0,
            "mag":0,
            "global":0
        },
        "def":0,
        "arm":0,
        "rm":0,
        "ressources":{
            "hp":0,
            "mana":0
        }
    }
*/

