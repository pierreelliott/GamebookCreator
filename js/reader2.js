/**
 * @author Pierre-Elliott Thiboud / http://pierreelliott.github.io/
 *
 * Copyright (c) 2017 Pierre-Elliott Thiboud
 * All rights reserved
 */

 function changeBackground(img) {
	return document.getElementById("image").style.backgroundImage = "url("+img+")";
}

function appearCharacter() {
	return document.getElementById("character").style.opacity = 1;
}
function hideCharacter() {
	return document.getElementById("character").style.opacity = 0;
}
function changeCharacter(character) {
	return document.getElementById("character").textContent = character.name;
}

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

function readType2() {

}
