window.onload = function () {
	var placeholder = document.getElementById("creationField");
	var creator = new InteractiveAdventure(placeholder);

	var btn_menuSave = document.getElementById("btn_menuSave");
	btn_menuSave.onclick = function() {
		var story = creator.save();
		var uri = 'data:text/json;charset=utf8,' + encodeURIComponent(JSON.stringify(story));
		var dlAnchorElem = document.getElementById('downloadAnchorElem');
		dlAnchorElem.setAttribute("href",     uri     );
		dlAnchorElem.setAttribute("download", story.name+".json");
		dlAnchorElem.click();
	}
};

function InteractiveAdventure(args) {
	this._constructor_(args);
}
InteractiveAdventure.prototype = {
	DOMelem: "",
	story: "",
	situations: [],

	_constructor_: function (parent) {
		this.story = {
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
		this._createDOMelem_(parent);
	},
	_createDOMelem_: function (parent) {
		var creatorField = document.createElement("div");
		creatorField.className = "situations";
		this.DOMelem = creatorField;
		parent.append(creatorField);

		var btn_addSituation = this._createBtn_AddSituation_();
		parent.append(btn_addSituation);
	},
	_createBtn_AddSituation_: function () {
		var storyobject = this.story;
		var IASituations = this.situations;
		var domElem = this.DOMelem;

		var btn_addSituation = document.createElement("div");
		btn_addSituation.textContent = " Add situation";
		btn_addSituation.className = "btn-add btn-add-situation fa fa-map-o";
		btn_addSituation.onclick = function() {
			var newSituation = { id: "situation"+storyobject.situationsNumber,
								content: [],
								choices: [],
							 	choicesNumber: 0 };
			storyobject.situationsNumber++;
			storyobject.situations.push(newSituation);
			IASituations.push(new Situation(domElem, newSituation));
		};

		return btn_addSituation;
	},
	save: function () {
		this.story.lastModificationDate = new Date();
		return this.story;
	},
	print: function () {
		console.log(this.story);
	}
}

function Situation() {
	this._constructor_(arguments);
}
Situation.prototype = {
	DOMelem: "",
	jsonObject: "",
	DOMContent: "",
	DOMChoices: "",
	content: [],
	choices: [],

	_constructor_: function (arguments) {
		var parent = arguments[0];
		var jsonObject = arguments[1];
		this.jsonObject = jsonObject;
		this.DOMelem = this._createDOMelem_();
		parent.append(this.DOMelem);
	},
	_createDOMelem_: function () {
		var situation = document.createElement("div");

		var situationHeader = document.createElement("div");
		situationHeader.className = "situation-header";
		situationHeader.textContent = "Situation";
		situationHeader.onclick = function() { toggleDisplay(situationHeader); };

		var situationContent = document.createElement("div");
		situationContent.className = "situation-content";
		this.DOMcontent = situationContent;

		var situationButtons = document.createElement("div");
		situationButtons.className = "situation-buttons";
		var btn_addText = this._createBtn_AddText_();
		var btn_addAction = this._createBtn_AddAction_();
		situationButtons.append(btn_addText);
		situationButtons.append(btn_addAction);

		var situationChoices = document.createElement("div");
		situationChoices.className = "situation-choices";
		this.DOMchoices = situationChoices;

		var situationAddChoices = document.createElement("div");
		situationAddChoices.className = "situation-addChoices";
		var btn_addChoice = this._createBtn_AddChoice_();
		situationAddChoices.append(btn_addChoice);

		situation.className = "situation active";
		situation.append(situationHeader);
		situation.append(situationContent);
		situation.append(situationButtons);
		situation.append(situationChoices);
		situation.append(situationAddChoices);


		return situation;
	},
	_createBtn_AddChoice_: function () {
		var jsonObject = this.jsonObject;
		var choices = this.choices;
		var domChoices = this.DOMchoices;

		var btn_addChoice = document.createElement("div");
		btn_addChoice.textContent = " Add choice";
		btn_addChoice.className = "btn-add btn-add-choice fa fa-map-signs";
		btn_addChoice.onclick = function() {
			var newChoice = { id: jsonObject.id+"_choice"+jsonObject.choicesNumber,
								name: "Choice",
								content: [] };
			jsonObject.choicesNumber++;
			jsonObject.choices.push(newChoice);
			choices.push(new Choice(domChoices));
		};

		return btn_addChoice;
	},
	_createBtn_AddText_: function () {
		var jsonObject = this.jsonObject;
		var content = this.content;
		var domContent = this.DOMcontent;

		var btn_addText = document.createElement("div");
		btn_addText.textContent = " Add textarea";
		btn_addText.className = "btn-add btn-add-text fa fa-edit";
		btn_addText.onclick = function() {
			var newText = { type: "text",
								content: "" };
			jsonObject.content.push(newText);
			content.push(new Textarea(domContent, newText));
		};

		return btn_addText;
	},
	_createBtn_AddAction_: function () {
		var jsonObject = this.jsonObject;
		var content = this.content;
		var domContent = this.DOMcontent;

		var btn_addAction = document.createElement("div");
		btn_addAction.textContent = " Add action";
		btn_addAction.className = "btn-add btn-add-action fa fa-cog";
		btn_addAction.onclick = function() {
			var newAction = { type: "action",
								action: "" };
			jsonObject.content.push(newAction);
			content.push(new Action(domContent, newAction));
		};

		return btn_addAction;
	},
}

function Textarea() {
	this._constructor_(arguments);
}
Textarea.prototype = {
	DOMelem: "",
	jsonObject: "",

	_constructor_: function (arguments) {
		var parent = arguments[0];
		var jsonObject = arguments[1];
		this.jsonObject = jsonObject;
		this.DOMelem = this._createDOMelem_();
		parent.append(this.DOMelem);
	},
	_createDOMelem_: function () {
		var div = document.createElement("div");
		var textHeader = document.createElement("div");
		var textContent = this._createEditableField_();

		div.className = "text";
		textHeader.className = "text-header"
		div.append(textHeader);
		div.append(textContent);

		return div;
	},
	_createEditableField_: function () {
		var jsonObject = this.jsonObject;
		var text = document.createElement("div");

		text.className = "text-field";
		text.contentEditable = "true";
		text.oninput = function () {
			jsonObject.content = text.innerHTML.replace(/<br>/gi,"\n");//.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
			// Need to handle the separation in multiple lines in the array (-> .split("\n") ?)
		}

		return text;
	}
}

function Action() {
	this._constructor_(arguments);
}
Action.prototype = {
	DOMelem: "",
	jsonObject: "",

	_constructor_: function (arguments) {
		var parent = arguments[0];
		var jsonObject = arguments[1];
		this.jsonObject = jsonObject;
		this.DOMelem = this._createDOMelem_();
		parent.append(this.DOMelem);
	},
	_createDOMelem_: function () {
		var div = document.createElement("div");
		var select = document.createElement("select");

		var actions = ['Action 1', 'Action 2', 'Action 3'];
		actions.forEach(function(element) {
			select.append(function (text) {
				var option = document.createElement("option");
				option.textContent = element;
				option.value = element;
				return option;
			});
		});

		// select.onchange(...jsonObject.action = ...) -> update jsonObject

		div.className = "action";
		div.append(select);

		return div;
	},
	_createActionsOptions_: function (text) {
		var option = document.createElement("option");
		option.textContent = text;
		option.value = text;
		return option;
	}
}

function Choice() {
	this._constructor_(arguments);
}
Choice.prototype = {
	DOMelem: "",
	jsonObject: "",

	_constructor_: function (arguments) {
		var parent = arguments[0];
		this.jsonObject = arguments[1];
		this.DOMelem = this._createDOMelem_();
		parent.append(this.DOMelem);
	},
	_createDOMelem_: function () {
		var div = document.createElement("div");
		var choiceHeader = document.createElement("div");
		var choiceContent = this._createEditableField_();

		div.className = "choice";
		choiceHeader.className = "choice-header"
		div.append(choiceHeader);
		div.append(choiceContent);

		return div;
	},
	_createEditableField_: function () {
		var jsonObject = this.jsonObject;
		var text = document.createElement("div");

		text.className = "choice-field";
		text.contentEditable = "true";
		text.oninput = function () {
			this.jsonObject.name = text.innerHTML.replace(/<br>/gi,"\n");
		}

		return text;
	}
}
