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
	getID() { return this.model.getID(); }

	addText() {
		var controller;
		var model = new TextModel(controller);
		var view = new TextView(controller, this.view.getDOMContent());
		controller = new Text(this, model, view);
		this.model.addElement(controller);
	}
	addAction() {
		var controller;
		var model = new ActionModel(controller);
		var view = new ActionView(controller, this.view.getDOMContent());
		controller = new Action(this, model, view);
		this.model.addElement(controller);
	}

	addChoice() {
		var controller;
		var model = new ChoiceModel(controller, this.model.getID(), this.model.incrementChoicesCount());
		var view = new ChoiceView(controller, this.view.getDOMChoices());
		controller = new Choice(this, model, view);
		this.model.addChoice(controller);
	}
}
class SituationModel {
	constructor(controller, id) {
		this.controller = controller;
		this.id = "situation"+id;
		this.content = [];
		this.choices = [];
		this.choicesNumber = 0;
	}

	getID() { return this.id; }
	incrementChoicesCount() { return ++this.choicesNumber; }

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
	constructor(controller, parentSituationID, choicesCount) {
		super(controller, "");
		this.id = parentSituationID + "_choice" + choicesCount;
		this.name = "";
		this.situationLink = "";
	}
}
class ChoiceView extends ElementView {
	constructor(controller, parentDOM) {
		super(controller, parentDOM);
	}

	createDOMelem() {
		var div = document.createElement("div");
		var choiceHeader = document.createElement("div");
		var choiceName = this.createEditableField(this.controller.changeName);
		var choiceLink = this.createEditableField(this.controller.changeLink);

		div.className = "choice";
		choiceHeader.className = "choice-header"
		div.append(choiceHeader);
		div.append(choiceName);
		div.append(choiceLink);

		this.DOMElement = div;
		this.parentDOM.append(this.DOMElement);
	}
	createEditableField(callbackFunction) {
		var text = document.createElement("textarea");

		text.oninput = callbackFunction(textField.innerHTML);

		return text;
	}
}

class Text extends Element {
	constructor(parentObject, model, view) {
		super(parentObject, model, view);
	}
	getText() { return this.model.getText(); }
	setText(newText) { this.model.setText(newText); }
}
class TextModel extends ElementModel {
	constructor(controller) {
		super(controller, "text");
		this.content = [];
	}
	getText() { return this.content; }
	setText(newText) {
		if(true) { // if newText is not an array
			this.content = newText.split("\n");
		} else {
			this.content = newText;
		}
	}

}
class TextView extends ElementView {
	constructor(controller, parentDOM) {
		super(controller, parentDOM);
		this.createDOMElem();
	}

	createDOMElem() {
		var div = document.createElement("div");
		var textHeader = document.createElement("div");
		var textContent = this.createEditableField();

		div.className = "text";
		textHeader.className = "text-header"
		div.append(textHeader);
		div.append(textContent);

		this.DOMElement = div;
		this.parentDOM.append(this.DOMElement);
	}
	createEditableField() {
		var textField = document.createElement("textarea");

		textField.className = "text-field";
		textField.oninput = this.controller.setText(textField.innerHTML);

		return textField;
	}
}

class Action extends Element {
	constructor(parentObject, model, view) {
		super(parentObject, model, view);
	}

	getAction() { return this.model.getAction(); }
	setAction(newAction) { this.model.setAction(newAction); }

	getAvailableActions() {}
}
class ActionModel extends ElementModel {
	constructor(controller) {
		super(controller, "action");
		this.action = "";
		this.properties = new Map();
	}
	getAction() { return this.action; }
	setAction(newAction) {  }
}
class ActionView extends ElementView {
	constructor(controller, parentDOM) {
		super(controller, parentDOM);
		this.createDOMelem();
	}

	createDOMelem() {
		var div = document.createElement("div");
		var select = document.createElement("select");

		var actions = ['Action 1', 'Action 2', 'Action 3'];
		actions.forEach(function(element) {
			var option = document.createElement("option");
			option.textContent = element;
			option.value = element;

			select.append(option);
		});

		// select.onchange(...jsonObject.action = ...) -> update model

		div.className = "action";
		div.append(select);

		this.DOMElement = div;
		this.parentDOM.append(this.DOMElement);
	}
}
