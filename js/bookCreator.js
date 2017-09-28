function InteractiveAdventure() {
	this._constructor_.apply(this, args);
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
		this.DOMelem = this._createDOMelem_();
		parent.append(DOMelem);
	},
	_createDOMelem_: function () {
		var btn_addSituation = this._createBtn_AddSituation_();
	},
	_createBtn_AddSituation_: function () {
		var btn_addSituation = document.createElement("div");
		btn_addSituation.className = "btn-add btn-add-situation fa fa-map-o";
		btn_addSituation.onclick = function() {
			var newSituation = { id: "situation"+story.situationsNumber,
								choices: [],
							 	choicesNumber: 0 };
			story.situationsNumber++;
			story.situations.push(newSituation);
			this.situations.push(new Situation(DOMelem, newSituation));
		};

		return btn_addSituation;
	},
	save: function () {

	}
}

function Situation() {
	this._constructor_.apply(this, args);
}
Situation.prototype = {
	DOMelem: "",
	jsonObject: "",
	DOMContent: "",
	DOMChoices: "",
	content: [],
	choices: [],

	_constructor_: function (parent, jsonObject) {
		this.jsonObject = jsonObject;
		this.DOMelem = this._createDOMelem_();
		parent.append(DOMelem);
	},
	_createDOMelem_: function () {
		var situation = document.createElement("div");

		var situationHeader = document.createElement("div");
		situationHeader.className = "situation-header";
		situationHeader.textContent = "Situation";
		situationHeader.onclick = function() { toggleDisplay(situationHeader); };

		var situationContent = document.createElement("div");
		situationContent.className = "situation-content";

		var situationButtons = document.createElement("div");
		situationButtons.className = "situation-buttons";
		var btn_addText = this._createBtn_AddText_();
		var btn_addAction = this._createBtn_AddAction_();
		situationButtons.append(btn_addText);
		situationButtons.append(btn_addAction);

		var situationChoices = document.createElement("div");
		situationChoices.className = "situation-choices";

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

		this.DOMcontent = situationContent;
		this.DOMchoices = situationChoices;

		return situation;
	},
	_createBtn_AddChoice_: function () {
		var btn_addChoice = document.createElement("div");
		btn_addChoice.className = "btn-add btn-add-choice fa fa-map-signs";
		btn_addChoice.onclick = function() {
			var newChoice = { id: jsonObject.id+"_choice"+jsonObject.choicesNumber,
								name: "Choice",
								content: [] };
			jsonObject.choicesNumber++;
			this.jsonObject.push();
			this.choices.push(new Choice(DOMchoices));
		};

		return btn_addChoice;
	},
	_createBtn_AddText_: function () {
		var btn_addText = document.createElement("div");
		btn_addText.className = "btn-add btn-add-text fa fa-edit";
		btn_addText.onclick = function() {
			var newText = { type: "text",
								content: "" };
			this.jsonObject.push(newText);
			this.content.push(new Textarea(DOMcontent, newText));
		};

		return btn_addText;
	},
	_createBtn_AddAction_: function () {
		var btn_addAction = document.createElement("div");
		btn_addAction.className = "btn-add btn-add-action fa fa-cog";
		btn_addAction.onclick = function() {
			var newAction = { type: "action",
								action: "" };
			this.jsonObject.push(newAction);
			this.content.push(new Action(DOMcontent, newAction));
		};

		return btn_addAction;
	},
}

function Textarea() {
	this._constructor_.apply(this, args);
}
Textarea.prototype = {
	DOMelem: "",
	jsonObject: "",

	_constructor_: function (parent, jsonObject) {
		this.jsonObject = jsonObject;
		this.DOMelem = this._createDOMelem_();
		parent.append(DOMelem);
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
	this._constructor_.apply(this, args);
}
Action.prototype = {
	DOMelem: "",
	jsonObject: "",

	_constructor_: function (parent, jsonObject) {
		this.jsonObject = jsonObject;
		this.DOMelem = this._createDOMelem_();
		parent.append(DOMelem);
	},
	_createDOMelem_: function () {
		var div = document.createElement("div");
		var select = document.createElement("select");

		var actions = ['Action 1', 'Action 2', 'Action 3'];
		actions.forEach(function(element) {
		  select.append(this._createActionsOptions_(element));
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
	this._constructor_.apply(this, args);
}
Choice.prototype = {
	DOMelem: "",

	_constructor_: function (parent) {
		this.DOMelem = this._createDOMelem_();
		parent.append(DOMelem);
	},
	_createDOMelem_: function () {

	}
}
