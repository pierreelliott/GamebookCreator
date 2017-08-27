function addField(btn, typeOfField) {
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

	var field = createField();

	parentOfBtn.insertBefore(field, btn);
}

function createSituation() {
	var situation = document.createElement("div");
	var situationHeader = document.createElement("div");
	var situationContent = document.createElement("div");
	var btn_addChoice = document.createElement("div");

	btn_addChoice.className = "btn-add btn-add-choice fa fa-map-signs";
	//btn_addChoice.textContent = "+";
	btn_addChoice.onclick = function() { addField(btn_addChoice,'choice'); };
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

function createChoice() {
	var choice = document.createElement("div");
	var choiceHeader = document.createElement("div");
	var choiceContent = document.createElement("div");

	var btn_group = document.createElement("div");
	var btn_addText = document.createElement("div");
	var btn_addAction = document.createElement("div");

	btn_group.className = "btn-group";
	btn_addText.className = "btn-add btn-add-text fa fa-edit";
	btn_addText.onclick = function() { addField(btn_addText,'text'); };
	btn_addAction.className = "btn-add btn-add-action fa fa-cog";
	btn_addAction.onclick = function() { addField(btn_addAction,'action'); };
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

function createText() {
	var div = document.createElement("div");
	var text = document.createElement("textarea");

	div.className = "text";
	div.append(text);

	return div;
}
