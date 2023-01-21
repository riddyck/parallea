export const preloadHandlebarsTemplates = async function() {

	const templatePaths = [
        "systems/parallea/templates/sheets/test.html"
    ];

	console.log(`Load templates`);
	return loadTemplates(templatePaths);
};