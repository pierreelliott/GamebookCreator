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
