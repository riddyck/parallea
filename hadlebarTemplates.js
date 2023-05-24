export const preloadHandlebarsTemplates = async function() {

	const templatePaths = [
		"systems/parallea/templates/navTabs/actor/playerFeatures.html",
		"systems/parallea/templates/navTabs/actor/playerInventory.html",
		"systems/parallea/templates/navTabs/actor/playerSpells.html",
		"systems/parallea/templates/navTabs/actor/playerLore.html",
		"systems/parallea/templates/navTabs/actor/playerSettings.html",

		"systems/parallea/templates/navTabs/item/weaponFeatures.html",
		"systems/parallea/templates/navTabs/item/weaponSettings.html",
		"systems/parallea/templates/navTabs/item/weaponRunes.html",
		
		"systems/parallea/templates/navTabs/item/assaultFeatures.html",
		"systems/parallea/templates/navTabs/item/assaultSettings.html",

		"systems/parallea/templates/navTabs/item/armorFeatures.html",
		"systems/parallea/templates/navTabs/item/armorSettings.html",
		"systems/parallea/templates/navTabs/item/armorRunes.html",

		"systems/parallea/templates/navTabs/item/spellFeatures.html",
		"systems/parallea/templates/navTabs/item/spellSettings.html",

		"systems/parallea/templates/navTabs/item/skillFeatures.html",
		"systems/parallea/templates/navTabs/item/skillSettings.html"
    ];

	console.log(`Load templates`);
	return loadTemplates(templatePaths);
};