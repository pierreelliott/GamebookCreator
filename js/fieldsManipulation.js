/**
 * @author Pierre-Elliott Thiboud / http://pierreelliott.github.io/
 *
 * Copyright (c) 2017 Pierre-Elliott Thiboud
 * All rights reserved
 */

 function addField(btn, typeOfField, jsonObject) {
	var parentOfBtn = btn.parentNode;
	var createField;

	switch(typeOfField) {
		case "situation":
			createField = createSituation;
			break;
		case "choice":
			createField = createChoice;
			break;
		case "text":
			createField = createText;
			btn = parentOfBtn;
			parentOfBtn = parentOfBtn.parentNode;
			break;
		case "action":
			createField = createAction;
			btn = parentOfBtn;
			parentOfBtn = parentOfBtn.parentNode;
			break;
		default:
			console.warn("Function not defined");
			return;
	}

	var field = createField(jsonObject);

	parentOfBtn.insertBefore(field, btn);
}

function createSituation(jsonObject) {
	var situation = document.createElement("div");
	var situationHeader = document.createElement("div");
	var situationContent = document.createElement("div");
	var btn_addChoice = document.createElement("div");
	console.log("3");
	console.log(jsonObject);

	btn_addChoice.className = "btn-add btn-add-choice fa fa-map-signs";
	btn_addChoice.onclick = function() {
		jsonObject.choicesNumber++;
		var newChoice = { id: jsonObject.id+"_choice"+jsonObject.choicesNumber,
							name: "Choice",
							content: [] };
		jsonObject.choices.push(newChoice);
		addField(btn_addChoice, 'choice', newChoice);
	};
	situationContent.append(btn_addChoice);

	situationHeader.className = "situation-header";
	situationHeader.textContent = "Situation";
	situationHeader.onclick = function() { toggleDisplay(situationHeader); };
	situationContent.className = "situation-content";

	situation.className = "situation active";
	situation.append(situationHeader);
	situation.append(situationContent);

	return situation;
}

function createChoice(jsonObject) {
	var choice = document.createElement("div");
	var choiceHeader = document.createElement("div");
	var choiceContent = document.createElement("div");

	console.log("4");
	console.log(jsonObject);

	var btn_group = document.createElement("div");
	var btn_addText = document.createElement("div");
	var btn_addAction = document.createElement("div");

	btn_group.className = "btn-group";
	btn_addText.className = "btn-add btn-add-text fa fa-edit";
	btn_addText.onclick = function() {
		var newText = { type: "text",
							condition: [],
							content: "" };
		jsonObject.content.push(newText);
		addField(btn_addText,'text', newText);
	};
	btn_addAction.className = "btn-add btn-add-action fa fa-cog";
	btn_addAction.onclick = function() {
		var newAction = { id: "action",
							action: "" };
		jsonObject.content.push(newAction);
		addField(btn_addAction,'action', newAction);
	};
	btn_group.append(btn_addText);
	btn_group.append(btn_addAction);
	choiceContent.append(btn_group);

	choiceHeader.className = "choice-header";
	choiceHeader.textContent = "Choice";
	choiceHeader.onclick = function() { toggleDisplay(choiceHeader); };
	choiceContent.className = "choice-content";

	choice.className = "choice active";
	choice.append(choiceHeader);
	choice.append(choiceContent);

	return choice;
}

function createText(jsonObject) {
	var div = document.createElement("div");
	var textHeader = document.createElement("div");
	var textContent = createEditableField(jsonObject);

	console.log("5");
	console.log(jsonObject);

	div.className = "text";
	textHeader.className = "text-header"
	div.append(textHeader);
	div.append(textContent);

	return div;
}

function createEditableField(jsonObject) {
	var text = document.createElement("div");

	text.className = "text-field";
	text.contentEditable = "true";
	text.oninput = function () {
		jsonObject.content = text.innerHTML.replace(/<br>/gi,"\n");//.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
		//console.log("innerHTML : "+text.innerHTML.replace(/<br>/gi,"\n"));
		//console.log("textContent : "+text.textContent);
	}

	return text;
}

function createAction(jsonObject) {
	var div = document.createElement("div");
	var select = document.createElement("select");

	console.log("6");
	console.log(jsonObject);

	var actions = ['Action 1', 'Action 2', 'Action 3'];
	actions.forEach(function(element) {
	  select.append(createActionsOptions(element));
	});

	div.className = "action";
	div.append(select);

	return div;
}

function createActionsOptions(text) {
	var option = document.createElement("option");
	option.textContent = text;
	option.value = text;
	return option;
}
