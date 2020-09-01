function byteArrayToString(byteArray) {
	var str = "", i;
	for (i = 0; i < byteArray.length; ++i) {
		str += escape(String.fromCharCode(byteArray[i]))
	}
	return str
}

function escapeOutput(toOutput) {
	return toOutput.replace(/\&/g, '&')
		.replace(/\</g, '&lt;')
		.replace(/\>/g, '&gt;')
		.replace(/\"/g, '&quot;')
		.replace(/\'/g, '&#x27')
}

function regexWebsite(inp) {
	return /^(https?):\/\/[^\s$.?#].[^\s]*$/i.test(inp);
}

function progressOn(){
	$("#progressBarDialog").css("display", "block")
}

function progressOff(){
	$("#progressBarDialog").css("display", "none")
}