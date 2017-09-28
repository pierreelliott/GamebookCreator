window.onload = function() {
	var story = {
		name: "My Story",
		author: "default",
		creationDate: new Date(),
		lastModificationDate: new Date(),
		situations: [],
		situationsNumber: 0,
		ressources: {
			images: [],
			sounds: []
		}
	};

	var i = 0;

	console.log("1");

	console.log(story);

	var btn_addSituation = document.getElementById("btn_addSituation");
	btn_addSituation.onclick = function() {
		story.situationsNumber++;
		var newSituation = { id: "situation"+story.situationsNumber,
							choices: [],
						 	choicesNumber: 0 };
		story.situations.push(newSituation);
		addField(btn_addSituation, 'situation', newSituation);
	};

	var btn_menuSave = document.getElementById("btn_menuSave");
	btn_menuSave.onclick = function() {
		story.lastModificationDate = new Date();
		var uri = 'data:text/json;charset=utf8,' + encodeURIComponent(JSON.stringify(story));
		var dlAnchorElem = document.getElementById('downloadAnchorElem');
		dlAnchorElem.setAttribute("href",     uri     );
		dlAnchorElem.setAttribute("download", "MyStory.json");
		dlAnchorElem.click();
	}
};
