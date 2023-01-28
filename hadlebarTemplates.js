export const preloadHandlebarsTemplates = async function() {

	const templatePaths = [
		"systems/parallea/templates/navTabs/actor/playerFeatures.html",
		"systems/parallea/templates/navTabs/actor/playerInventory.html",
		"systems/parallea/templates/navTabs/actor/playerLore.html",
		"systems/parallea/templates/navTabs/actor/playerSettings.html",

		"systems/parallea/templates/navTabs/item/weaponFeatures.html",
		"systems/parallea/templates/navTabs/item/weaponSettings.html",
		"systems/parallea/templates/navTabs/item/spellFeatures.html",
		"systems/parallea/templates/navTabs/item/spellSettings.html"
    ];

	console.log(`Load templates`);
	return loadTemplates(templatePaths);
};