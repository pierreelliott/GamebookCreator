window.onload = function() {
	var story = {
		name: "",
		author: "",
		creationDate: "",
		lastModificationDate: "",
		startingSituation : {
			content: [],
			link: ""
		},
		situations: [],
		ressources: {
			images: [],
			sounds: []
		}
	};

	var i = 0, j = 0;

	console.log("hello");

	console.log(story);

	var btn_addSituation = document.getElementById("btn_addSituation");
	btn_addSituation.onclick = function(story) {
		var newSituation = { id: "situation"+i++,
							choices: [] };
		story["situations"].append(newSituation);
		addField(btn_addAction, 'situation', newSituation);
	};
};
