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

class InteractiveAdventure {
	constructor(parentDOM) {
		this.model = new InteractiveAdventureModel(this);
		this.view = new InteractiveAdventureView(this, parentDOM);
	}

	loadFile(file) {
		this.model.loadFile(file);
		/* Need to initialize the view too */
	}

	getDOM() { return this.view.getDOM(); }

	getName() {	return this.model.getName(); }
	//setName(newName) { this.model.setName(newName); }

	getAuthor() { return this.model.getAuthor(); }
	//setAuthor(newAuthor) { this.model.setAuthor(newAuthor); }

	getCreationDate() { return this.model.getCreationDate(); }

	getLastModificationDate() { return this.model.getLastModificationDate(); }

	getType() { return this.model.getType(); }
	//setType(newType) { this.model.setType(newType); }

	getStartingSituation() { return this.model.getStartingSituation(); }
	//setStartingSituation(situation) { this.model.setStartingSituation(situation); }

	getSituations() { return this.model.getSituations(); }
	createSituation() {
		// Create the variable here to be able to refer to it before its actual creation
		var newSituation;

		/* I give a reference to the controller to the model and the view so when
			something is out of their usecase, they call the controller instead	*/
		var situationModel = new SituationModel(newSituation, this.model.incrementSituationCount());
		var situationView = new SituationView(newSituation, this.getDOM());

		/* Only the controller get a reference on its parent element */
		newSituation = new Situation(this, situationModel, situationView);

		this.model.addSituation(newSituation); // Add the new situation object to the model
	}
	/*addSituation(situation) { this.model.addSituation(situation); }
	removeSituation(situation) { this.model.removeSituation(situation); }*/

	getSituationCount() { return this.model.getSituationCount(); }
}
class InteractiveAdventureModel {
	constructor(controller) {
		this.controller = controller;

		this.name = "My Story";
		this.author = "default";
		this.creationDate = new Date();
		this.lastModificationDate = new Date();
		this.type = "gameook";
		this.startingSituation = "";
		this.situations = []; /* Should change this to a Map,
		it will be easier to change a situation's ID */
		this.situationsNumber = 0;
		this.ressources = {
			/* À repenser pour faciliter et abstraire
				la gestion des ressources */
			res_images: [],
			res_sounds: []
		}
	}

	toString() {
		var file = {};
		file.name = this.name;
		file.author = this.author;
		file.creationDate = this.creationDate;
		file.lastModificationDate = this.lastModificationDate;
		file.type = this.type;
		file.startingSituation = this.startingSituation;
		file.situations = this.situations.forEach(function(situ) {
			return situ.toString();
		});
		file.situationsNumber = this.situationsNumber;
	}

	loadFile(file) {
		this.name = file.name;
		this.author = file.author;
		this.creationDate = file.creationDate;
		this.lastModificationDate = file.lastModificationDate;
		this.type = file.type;
		this.startingSituation = file.startingSituation;
		this.situations = file.situations.forEach(function (situ) {
			/* Need to recreate an object Situation and store it */
		});
		this.situationsNumber = file.situationsNumber;
		/* this.ressources = file.ressources; */
	}

	getName() {	return this.name; }
	setName(newName) { this.name = newName; }

	getAuthor() { return this.author; }
	setAuthor(newAuthor) { this.author = newAuthor };

	getCreationDate() { return this.creationDate; }

	getLastModificationDate() { return this.lastModificationDate; }
	modification() { this.lastModificationDate = new Date(); }

	getType() { return this.type; }
	setType(newType) { this.type = newType; }

	getStartingSituation() { return this.startingSituation; }
	setStartingSituation(situation) { this.startingSituation = situation; }

	getSituations() { return this.situations; }
	addSituation(situation) { this.situations.add(situation); }
	removeSituation(situation) { this.situations.remove(situation); }

	getSituationCount() { return this.situationsNumber; }
	incrementSituationCount() { return this.situationsNumber++; }
}
class InteractiveAdventureView {
	constructor(controller, parentDOM) {
		this.parentDOM = parentDOM;
		this.controller = controller;
		this.DOMElement;
		this.createDOM();
	}

	getDOM() { return this.DOMelement; }

	createDOM() {
		var creatorField = document.createElement("div");
		creatorField.className = "situations";
		this.DOMElement = creatorField;
		this.parentDOM.append(creatorField);

		var btn_addSituation = this.createBtn_AddSituation();
		this.parentDOM.append(btn_addSituation);
	}

	createBtn_AddSituation() {
		var btn_addSituation = document.createElement("div");
		btn_addSituation.textContent = " Add situation";
		btn_addSituation.className = "btn-add btn-add-situation fa fa-map-o";
		btn_addSituation.onclick = this.controller.createSituation();

		return btn_addSituation;
	}
}


class Situation {
	constructor(parentElem, model, view) {
		this.parentElement = parentElem;
		this.model = model;
		this.view = view;
	}

	getParent() { return this.parentElement; }

	addText() {
		var controller;
		var model = new TextModel(controller);
		var view = new TextView(this.view.getDOMContent());
		controller = new Text(model, view);
		this.model.addElement(controller);
	}
	addAction() {
		var controller;
		var model = new ActionModel(controller);
		var view = new ActionView(this.view.getDOMContent());
		controller = new Action(model, view);
		this.model.addElement(controller);
	}

	addChoice() {
		var controller;
		var model = new ChoiceModel(controller);
		var view = new ChoiceView(controller, this.view.getDOMChoices());
		controller = new Choice(this, model, view);
		this.model.addChoice(controller);
	}
}
class SituationModel {
	constructor(controller, id) {
		this.id = "situation"+id;
		this.controller = controller;
		this.content = [];
		this.choices = [];
		this.choicesNumber = 0;
	}

	addElement(newElement) {
		this.content.add(newElement);
	}

	addChoice(newChoice) {
		this.choices.add(newChoice);
	}
}
class SituationView {
	constructor(controller, parentDOM) {
		this.parentDOM = parentDOM;
		this.controller = controller;
		this.DOMElement;
		this.DOMChoices;
		this.DOMContent;
		this.createDOM();
	}

	createDOM() {
		var situation = document.createElement("div");

		var situationHeader = document.createElement("div");
		situationHeader.className = "situation-header";
		situationHeader.textContent = "Situation";
		situationHeader.onclick = function() { toggleDisplay(situationHeader); };

		var situationContent = document.createElement("div");
		situationContent.className = "situation-content";
		this.DOMContent = situationContent;

		var situationButtons = document.createElement("div");
		situationButtons.className = "situation-buttons";
		var btn_addText = this.createBtn_AddText();
		var btn_addAction = this.createBtn_AddAction();
		situationButtons.append(btn_addText);
		situationButtons.append(btn_addAction);

		var situationChoices = document.createElement("div");
		situationChoices.className = "situation-choices";
		this.DOMChoices = situationChoices;

		var situationAddChoices = document.createElement("div");
		situationAddChoices.className = "situation-addChoices";
		var btn_addChoice = this.createBtn_AddChoice();
		situationAddChoices.append(btn_addChoice);

		situation.className = "situation active";
		situation.append(situationHeader);
		situation.append(situationContent);
		situation.append(situationButtons);
		situation.append(situationChoices);
		situation.append(situationAddChoices);

		this.DOMElement = situation;
	}

	getDOM() { return this.DOMElement; }
	getDOMChoices() { return this.DOMChoices; }
	getDOMContent() { return this.DOMContent; }

	createBtn_AddChoice() {
		var jsonObject = this.jsonObject;
		var choices = this.choices;
		var domChoices = this.DOMchoices;

		var btn_addChoice = document.createElement("div");
		btn_addChoice.textContent = " Add choice";
		btn_addChoice.className = "btn-add btn-add-choice fa fa-map-signs";
		btn_addChoice.onclick = this.controller.addChoice();

		function() {
			var newChoice = { id: jsonObject.id+"_choice"+jsonObject.choicesNumber,
								name: "",
								link: "" };
			jsonObject.choicesNumber++;
			jsonObject.choices.push(newChoice);
			choices.push(new Choice(domChoices));
		};

		return btn_addChoice;
	}

	createBtn_AddText() {
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
	}

	createBtn_AddAction() {
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
	}
}

class Element {
	constructor(parentObject, model, view) {
		this.parentElement = parentObject;
		this.model = model;
		this.view = view;
	}
	getType() { return this.model.getType(); }
	getParent() { return this.parentElement; }

	getConditions() { return this.model.getConditions(); }
	setConditions() {  }
	removeCondition(index) { this.model.removeCondition(index); }
	addCondition(newCondition) { this.model.addCondition(newCondition); }
	hasCondition() { return this.model.hasCondition(); }
}
class ElementModel {
	constructor(controller, typeElem) {
		this.controller = controller;
		this.type = typeElem;
		this.conditions = [];
	}
	getType() { return this.type; }

	getConditions() {  }
	setConditions() {  }
	removeCondition(index) {  }
	addCondition(newCondition) {  }
	hasCondition() { return (this.conditions.length > 0); }
}
class ElementView {
	constructor(controller, parentDOM) {
		this.controller = controller;
		this.parentDOM = parentDOM;
		this.DOMElement = "";
	}
	getDOM() { return this.DOMelement; }
	getParentDOM() { return this.parentDOM; }
}

class Choice extends Element {
	constructor(parentObject,model,view) {
		super(parentObject,model,view);
	}
}
class ChoiceModel extends ElementModel {
	constructor(controller) {
		super(controller, "choice");
		this.name = "";
		this.situationLink = "";
	}
}
class ChoiceView extends ElementView {
	constructor(controller, parentDOM) {
		super(parentDOM);
	}
}

class Text extends Element {

}
class TextModel extends ElementModel {
	constructor(parentObject) {
		super(parentObject, "text");
		this.content = [];
	}
	getText() { return this.content; }
	setText(newText) {
		if(true) { // if newText is array
			this.content = newText.split("\n");
		} else {
			this.content = newText;
		}
	}

}
class TextView extends ElementView {
	createDOMElem() {
		var div = document.createElement("div");
		var textHeader = document.createElement("div");
		var textContent = this._createEditableField_();

		div.className = "text";
		textHeader.className = "text-header"
		div.append(textHeader);
		div.append(textContent);

		this.DOMElement = div;

		return div;
	}
	createEditableField() {
		/* Editable field isn't very easy to deal with
			so we should use a textarea instead */
		var jsonObject = this.jsonObject;
		var textField = document.createElement("div");

		textField.className = "text-field";
		textField.contentEditable = "true";
		textField.oninput = function () {
			jsonObject.content = textField.innerHTML.replace(/<br>/gi,"\n").split("\n");
			if(jsonObject.content[jsonObject.content.length-1] == "") {
				jsonObject.content.length--; // Remove the last object of the array
											// Apparently there's always a last <BR> that goes there
			}
		}

		return textField;
	}
}

class Action extends Element {
	getAvailableActions() {}
}
class ActionModel extends ElementModel {
	constructor(parentObject) {
		super(parentObject, "action");
		this.action = "";
		this.properties = new Map();
	}
	getAction() {  }
	setAction(newAction) {  }
}
class ActionView extends ElementView {

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
								name: "",
								link: "" };
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
			jsonObject.content = text.innerHTML.replace(/<br>/gi,"\n").split("\n");//.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
			if(jsonObject.content[jsonObject.content.length-1] == "") {
				jsonObject.content.length--; // Remove the last object of the array
											// Apparently there's always a last <BR> that goes there
			}
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
			var option = document.createElement("option");
			option.textContent = element;
			option.value = element;

			select.append(option);
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
		var choiceName = this._createEditableField_();
		var choiceLink = this._createEditableField_();

		div.className = "choice";
		choiceHeader.className = "choice-header"
		div.append(choiceHeader);
		div.append(choiceName);
		div.append(choiceLink);

		return div;
	},
	_createEditableField_: function () {
		var jsonObject = this.jsonObject;
		var text = document.createElement("textarea");

		/*text.type = "text";*/
		text.oninput = function () {
			this.jsonObject.name = text.textContent;
		}

		return text;
	}
}
