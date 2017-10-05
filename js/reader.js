window.onload = function () {
	var placeholder = document.getElementById("readerField");
	var reader = new InteractiveAdventureReader(placeholder, story);

	var btn_menuSave = document.getElementById("btn_menuSave");
	btn_menuSave.onclick = function() {
		var story = reader.save();
		var uri = 'data:text/json;charset=utf8,' + encodeURIComponent(JSON.stringify(story));
		var dlAnchorElem = document.getElementById('downloadAnchorElem');
		dlAnchorElem.setAttribute("href",     uri     );
		dlAnchorElem.setAttribute("download", story.name+".json");
		dlAnchorElem.click();
	};

	function importSave(file) {
		var levelToLoad = JSON.parse(file);
		var checksum = levelToLoad.hash;
		delete levelToLoad.hash;
		if(checksum === hashCode(JSON.stringify(levelToLoad))) {
			//console.log(document.getElementById(levelToLoad.levelid).onclick);
			(document.getElementById(levelToLoad.levelid).onclick)(false);
			//document.getElementById(levelToLoad.levelid).click(false);
			levelToLoad.trace.forEach(function(obsel) {
				var button = document.getElementById(obsel.group);
				button.click();
			});
		} else {
			window.alert(translate("save_notValid"));
		}
	}


	function loadFile() {
		var fileinput = document.getElementById("fileinput");
		if(fileinput.files[0] != undefined) {
			var file = fileinput.files[0];

			if (file.type.match('application/json')) {
				var reader = new FileReader();

				reader.onload = function(){
					importSave(reader.result);
				};
				reader.readAsText(file);
	    	} else {
				window.alert(translate("save_wrongFormat"));
			}
		}
	}
};

function InteractiveAdventureReader() {
	this._constructor_(arguments);
}
InteractiveAdventureReader.prototype = {
	DOMelem: "",
	savegame: "",
	story: "",
	mode: "",

	imageDOM: "",
	optionDOM: "",
	choicesDOM_NV: "",
	choicesDOM_GB: "",
	characterDOM: "",
	textDOM: "",

	_constructor_: function (arguments) {
		var parent = arguments[0];
		var story = arguments[1];
		this.story = story;
		this.savegame = {
			storyID: "My Story",
			firstPlayDate: new Date(),
			lastPlayDate: new Date(),
			choices: [],
			currentSituation: story.startingSituation,
			currentChild: -1,
			currentLine: -1
		};
		this._createDOMelem_(parent);
	},
	_createDOMelem_: function (parent) {
		var readerField = document.createElement("div");
		readerField.id = "reader";

		var image = document.createElement("div");
		image.id = "readerImage";
		this.imageDOM = image;

		var option = document.createElement("div");
		option.id = "readerOption";	// Name will probably change
		this.optionDOM = option;

		var choices_NV = document.createElement("div");
		choices_NV.id = "readerChoices_NV";
		this.choicesDOM_NV = choices_NV;

		var choices_GB = document.createElement("div");
		choices_GB.id = "readerChoices_GB";
		this.choicesDOM_GB = choices_GB;

		var text = document.createElement("div");
		text.id = "readerText";
		this.textDOM = text;

		var character = document.createElement("div");
		character.id = "readerCharacter";
		this.characterDOM = character;

		image.append(option);
		image.append(choices_NV);
		image.append(text);
		text.append(character);
		text.append(choices_GB);
		readerField.append(image);

		this.DOMelem = readerField;
		parent.append(readerField);
	},
	_createChoiceDOM_: function (choice) {
		var chooseFunction = this.choose;
		var div = document.createElement("div");
		div.className = "choice"
		div.textContent = choice.name;
		// Bla bla bla
		div.onclick = function () {
			chooseFunction(choice);
		};
		// Bla bla bla
		return div;
	},
	displayChoices: function () {
		// Don't forget verifications
		var createChoiceDOMFunction = this._createChoiceDOM_;
		var parent; // Where to put choices to display
		switch (this.mode) {
			case "gamebook":
				parent = this.choicesDOM_GB;
				break;
			case "visual-novel":
				parent = this.choicesDOM_NV;
				this.toggleCharAndText();
				break;
			default:
		}
		this.story.situations[this.savegame.currentSituation].choices.forEach(function(e) {
			var choiceElem = createChoiceDOMFunction(e);
			parent.append(choiceElem);
		});

		// Hide character and text panels
		// Display choice panel
	},
	toggleCharAndText: function () {
		// Should try to do transition with opacity first and then, hide them completely
		if(this.textDOM.style.display == "none" && this.characterDOM.style.display == "none") {
			this.textDOM.style.display = "none";
			this.characterDOM.style.display = "none";
		} else {
			this.textDOM.style.display = "auto";
			this.characterDOM.style.display = "auto";
		}
	},

	save: function () {
		this.savegame.lastModificationDate = new Date();
		return this.savegame;
	},
	load: function (savegameFile) {
		// Do some verification on the savegame
		this.savegame = savegameFile;
		this.init();
	},
	print: function () {
		console.log(this.savegame);
	},
	start: function () {
		if(this.savegame.currentSituation !== undefined && this.story.situations[this.savegame.currentSituation] !== undefined
		&& this.savegame.currentChild !== undefined && this.story.situations[this.savegame.currentSituation].content[this.savegame.currentChild] !== undefined) {
			// Display the current child of the current situation
		}
	},
	display: function (typeOfData, data) {
		switch (typeOfData) {
			case "text":
				if(this.story.type === "gamebook") {

				}
				break;
			default:

		}
	},
	executeAction: function (actionObject) {

	},
	next: function () {
		var situation = this.story.situations[this.savegame.currentSituation];
		var child = this.story.situations[this.savegame.currentSituation].content[this.savegame.currentChild+1]
		if(child !== undefined) {
			if(child.type === "text") {
				// Another verification on the current line...
				var line = child.content[this.savegame.currentLine+1];
				if(line !== undefined) {
					this.display("text", line);
					// Display the line of text
					this.savegame.currentLine++;
				} else {
					this.savegame.currentChild++;
					this.savegame.currentLine = -1;
					this.next();
				}
			} else if(child.type === "action") {
				// Do the action
				this.executeAction(child)
				this.savegame.currentChild++;
				if(child.continue) {
					// If the creator decided to force-load the next element
					this.next();
				}
			}
		} else {
			// Verify var situation isn't undefined
			if(situation.choices.length > 0) { // Check if there are choices
				this.displayChoices();
			} else {
				// Display the back cover of the gamebook
			}
		}
	},
	choose: function (choiceObject) {
		var situation = this.story.situations[choiceObject.link];
		if(situation !== undefined) {
			this.savegame.currentSituation = choiceObject.link;
			this.savegame.currentChild = -1;
			this.savegame.currentLine = -1;
			this.savegame.choices.push(choiceObject.id);

			// Hide choice panel
			// Un-hide character and text panel

			this.next();
		}
	}
}
