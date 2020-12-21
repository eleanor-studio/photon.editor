// background setting
function updateBackground(useGradient) {

	let defaultBackground = "background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"
	let defaultHexCode = "gradient";

	let newBackground = defaultBackground;
	let newHexCode = defaultHexCode;

	if (!useGradient){
		newBackground = background.value;
		newHexCode = background.value;
	} 

	document.getElementById("world").style.background = newBackground;
	
	var span = document.getElementById("backgroundValue"),
    
    text = document.createTextNode(''+newHexCode);
	span.innerHTML = ''; // clear existing
	span.appendChild(text);

}

function transparentBackground() {
  var checkBox = document.getElementById("backgroundTransparent");
  var text = document.getElementById("confirm");
  if (checkBox.checked == true){
  	document.getElementById("world").style.background = "transparent";
    text.style.display = "block";
  } else {
     text.style.display = "none";
  }
}


