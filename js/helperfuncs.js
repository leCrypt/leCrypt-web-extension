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

function noteItemGive(title, note) {
	var noteItem = '' +
		'<div class="notesItem" style="border-style: solid; border-color: black; border-width: 4px; border-radius: 5px; font-size: medium; margin: 0.5em; padding-left: 2%; padding-bottom: 2%; background-color: white; color: black;">' +
		' <li>' +
		' <div class="notes-header" style="display: flex; justify-content: space-between;">' +
		'   <input readonly style="margin-top: 2%; margin-bottom: 2%; margin-left: 1%; width: 85%; font-weight: bold; font-size: 24px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; vertical-align: middle;  border-style: solid; border-radius: 4px; border-color: black; border-width: 2px; font-size: large; box-shadow: 0px 0px;" class="title" value="'+title+'">' +
		'   <div class="smallboxes edit-note" style="margin-top: 1.3%;"><i class="fas fa-pen"></i></div>' +
		'	<div class="smallboxes save-note" style="margin-top: 1.8%; display: none;"><i class="fas fa-check"></i></div>' +
		' </div>' +
		'   <div style="width:80%; border: 2px solid #6c63ff; border-radius: 50px;"></div>' +
		' 	<div style="display: flex; justify-content: space-between;">' +
		'   	<textarea readonly class="note" style="margin-top: 2%; margin-bottom: 2%; margin-left: 1%; width: 85%; font-size: 12px; border-style: solid; border-radius: 4px; border-color: black; border-width: 2px; font-size: large; box-shadow: 0px 0px;">' + note + '</textarea>' +
		'		<div class="smallboxes delete-note" style="margin-top: 1%;"><i class="fas fa-trash"></i></div>' +
		'	</div>' +
		' </li>' +
		'</div>'
	return noteItem
}

function passItemGive(website, username, password) {
	var passItem = '' +
		'<div class="passesItem" style="border-style: solid; border-color: black; border-width: 4px; border-radius: 5px; font-size: medium; margin: 0.5em; padding-left: 2%; padding-bottom: 2%; background-color: white; color: black;">' +
		' <li>' +
		'   <div class="password-header" style="display: flex; justify-content: space-between;">' +
		'     <input readonly class="website" style="margin-top: 2%; margin-bottom: 2%; margin-left: 1%; width: 85%; font-weight: bold; font-size: 16px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; vertical-align: middle;  border-style: solid; border-radius: 4px; border-color: black; border-width: 2px; font-size: large; box-shadow: 0px 0px;" value="' + website + '">' +
		'     <div class="smallboxes edit-password" style="margin-top: 1.8%;"><i class="fas fa-pen"></i></div>' +
		'	  <div class="smallboxes save-password" style="margin-top: 1.8%; display: none;"><i class="fas fa-check"></i></div>' +
		'   </div>' +
		'   <div style="width:80%; border: 2px solid #6c63ff; border-radius: 50px;"></div>' +
		'   <div style="display: flex; justify-content: space-between;">' +
		'   	<input readonly class="username" style="width: 85%; font-size: large; margin-left: 1%; margin-top: 2.5%; display: inline-block; word-break: break-word; vertical-align: middle; border-style: solid; border-radius: 4px; border-color: black; border-width: 2px; font-size: large; box-shadow: 0px 0px;" value="' + username + '">' +
		'		<div class="smallboxes delete-password" style="margin-top: 1.8%;"><i class="fas fa-trash"></i></div>' +
		' 	</div>' +
		'   <div class="password-group" style="margin:1%;">' +
		'   <div>' +
		'     <input readonly class="form-control password-box" type="password" style="vertical-align: middle; width:73%; margin: 0px; margin-right: 2%; border-style: solid; border-radius: 4px; border-color: black; border-width: 2px; font-size: large; box-shadow: 0px 0px;" value="' + password + '">' +
		'     <span style="font-size: x-large; vertical-align: middle; margin-bottom: 3px;" class="clipper tooltip"><b><i class="far fa-clipboard"></i></b><span class="tooltiptext">copy</span></span>' +
		'     <input type="checkbox" class="password-visibility" style="width: 28px; height: 28px; margin-left: 2%; vertical-align: middle; box-shadow: 0px 0px;">' +
		'   </div>' +
		'   </div>' +
		' </li>' +
		'</div>'
	return passItem
}