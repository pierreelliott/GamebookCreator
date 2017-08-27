function toggleDisplay(elementHeader) {
	var parent = elementHeader.parentNode;
	if (parent.classList) {
    	parent.classList.toggle("active");
	} else {
	    // For IE9
	    var classes = parent.className.split(" ");
	    var i = classes.indexOf("active");

	    if (i >= 0)
	        classes.splice(i, 1);
	    else
	        classes.push("active");
	        parent.className = classes.join(" ");
	}
}
