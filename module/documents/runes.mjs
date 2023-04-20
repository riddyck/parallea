export function edgePrep(stats,rune) {
    stats.damage.global+=1*rune.level;
}

export function powerPrep(stats,rune) {
    stats.damage.global+=1*rune.level;
}

export function hardnessPrep(stats,rune) {
    stats.damage.global+=2+1*rune.level;
    stats.attack.global+=-1*rune.level;
}

export function firePrep(stats,rune) {
    stats.attack.global+=1*rune.level;
    stats.damage.global+=1*rune.level;
}



export function resistancePrep(stats,rune) {
    stats.defense.arm+=1+1*rune.level;
}

export function protectionPrep(stats,rune) {
    stats.defense.rm+=1+1*rune.level;
}

export function reinforcePrep(stats,rune) {
    stats.defense.arm+=1+1*rune.level;
    stats.defense.rm+=1+1*rune.level;
    stats.defense.def+=-1*rune.level;
}



export function manaPrep(stats,rune) {
    stats.ressources.mana+=2*rune.level;
}

export function magicPowerPrep(stats,rune) {
    stats.damage.mag+=1*rune.level;
}

export function magicFocusPrep(stats,rune) {
    stats.attack.mag+=1+1*rune.level;
}

export function magicOverchagePrep(stats,rune) {
    stats.attack.mag+=1*rune.level;
    stats.damage.mag+=1*rune.level;
    stats.defense.def+=-1*rune.level;
}



export function lightPrep(stats,rune) {
    stats.attack.phy+=7*rune.level;
    stats.damage.mag+=17*rune.level;
    stats.damage.global+=10*rune.level;
    stats.attack.global+=10*rune.level;
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
        "defense":{
        "def":0,
        "arm":0,
        "rm":0
        },
        "ressources":{
            "hp":0,
            "mana":0
        }
    }
*/

