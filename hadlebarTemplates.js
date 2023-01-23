export const preloadHandlebarsTemplates = async function() {

	const templatePaths = [
        "systems/parallea/templates/sheets/test.html",
		"systems/parallea/templates/navTabs/inventoryTab.html",
		"systems/parallea/templates/navTabs/loreTab.html",
		"systems/parallea/templates/navTabs/featuresTab.html"
    ];

	console.log(`Load templates`);
	return loadTemplates(templatePaths);
};