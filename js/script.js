var decryptedPasswords = []
var decryptedNotes = []

var encNotes = null
var encPasses = null

var ik = null

var searching = false

var passesRangeBottom = 9
var passesRangeTop = 0
var notesRangeBottom = 9
var notesRangeTop = 0

var notesScrollPos = 0
var passesScrollPos = 0

$("#addSecNote").click(function () {
	$("#addSecNoteDialog").css("display", "block")
	$("#addSecNoteDialogTitle").text("Add Note")
	$("#addSecNoteInputTitle").val("")
	$("#addSecNoteInputTextArea").val("")
	$("#addSecNoteSubmitError").val("")
	$("#addSecNoteSaveBtn").show()
	$("#saveEditNoteBtn").hide()
	$("#deleteEditNoteBtn").hide()
});

$("#addSecPassword").click(function () {
	$("#addSecPasswordDialog").css("display", "block")
	$("#addSecPasswordDialogTitle").text("Add Password")
	$("#addSecPasswordInputWebsite").val("")
	$("#addSecPasswordInputUsername").val("")
	$("#addSecPasswordInputPassword").val("")
	$("#addSecPasswordSubmitError").val("")
	$("#addSecPasswordSaveBtn").show()
	$("#saveEditPasswordBtn").hide()
	$("#deleteEditPasswordBtn").hide()
});

$('#passesListDiv').scroll(function () {
	//console.log("scrollTop: "+this.scrollTop)
	if (this.scrollTop >= 800) {
		if (passesRangeBottom + 4 <= encPasses.length+5 && !searching) {
			passesRangeBottom +=4
			passesRangeTop +=4
			console.log("passesRangeBottom: "+passesRangeBottom)
			console.log("passesRangeTop: "+passesRangeTop)
			console.log("passes list bottom reached!")
			arr = [...decryptedPasswords]
			generatePassesReadables(ik, arr.slice(passesRangeTop, passesRangeBottom))
			$(this).scrollTop(200)
		}
	} else if (this.scrollTop < 200 && !searching) {
		if (passesRangeTop != 0) {
			passesRangeBottom -=4
			passesRangeTop -=4
			console.log("passesRangeBottom: "+passesRangeBottom)
			console.log("passesRangeTop: "+passesRangeTop)
			console.log("passes list top reached!")
			arr = [...decryptedPasswords]
			generatePassesReadables(ik, arr.slice(passesRangeTop, passesRangeBottom))
			$(this).scrollTop(780)	
		}
	}
})

$('#notesListDiv').scroll(function () {
	//console.log("scrollTop: "+this.scrollTop)
	if (this.scrollTop >= 800) {
		if (notesRangeBottom + 4 <= encNotes.length+5 && !searching) {
			notesRangeBottom +=4
			notesRangeTop +=4
			console.log("notesRangeBottom: "+notesRangeBottom)
			console.log("notesRangeTop: "+notesRangeTop)
			console.log("notes list bottom reached!")
			arr = [...decryptedNotes]
			generateNotesReadables(ik, arr.slice(notesRangeTop, notesRangeBottom))
			$(this).scrollTop(200)
		}
	} else if (this.scrollTop < 200 && !searching) {
		if (notesRangeTop != 0) {
			notesRangeBottom -=4
			notesRangeTop -=4
			console.log("notesRangeBottom: "+notesRangeBottom)
			console.log("notesRangeTop: "+notesRangeTop)
			console.log("notes list bottom reached!")
			arr = [...decryptedNotes]
			generateNotesReadables(ik, arr.slice(notesRangeTop, notesRangeBottom))
			$(this).scrollTop(780)
		}
	}
})

$("#searchBarNotePasswordSubmit").click(function () {
	//todo improve the search algorithm
	var search = $("#searchBarNotePasswordInput").val().toLowerCase()

	if (ik != undefined) {
		progressOn()
		notesScrollPos = $("#passesListDiv").scrollTop
		passesScrollPos = $("#notesListDiv").scrollTop
		filteredNotes = decryptedNotes.filter(function (value, i, arr) {
			var title = arr[i].getTitle().toLowerCase();
			var note = arr[i].getNote().toLowerCase();
			return title.includes(search) || note.includes(search)
		})
		generateNotesReadables(ik, filteredNotes)
		filteredPassword = decryptedPasswords.filter(function (value, i, arr) {
			var website = arr[i].getWebsite().toLowerCase();
			var username = arr[i].getUsername().toLowerCase();
			return website.includes(search) || username.includes(search)
		})
		generatePassesReadables(ik, filteredPassword)
		progressOff()
	}
})

$("#searchBarNotePasswordInput").on("input", function () {
	var search = $("#searchBarNotePasswordInput").val().toLowerCase()
	if (search != "") {
		searching = true
	} else {
		arr = [...decryptedPasswords]
		arrNotes = [...decryptedNotes]
		generateNotesReadables(ik, arrNotes.slice(notesRangeTop, notesRangeBottom))
		generatePassesReadables(ik, arr.slice(passesRangeTop, passesRangeBottom))
		$("#notesListDiv").scrollTop(notesScrollPos)
		$("#passesListDiv").scrollTop(passesScrollPos)
		searching = false;
	}
})

$("#searchBarNotePassword").ready(function(){
	$('#searchBarNotePasswordInput').keydown(function (e) {
		if (e.keyCode == 13) {
			$('#searchBarNotePasswordSubmit').click();
		}
	});
})


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

function loadUserData() {
	progressOn()
	console.log("[DEBUG] Starting to load user data!")
	chrome.storage.local.get(['secpassNotesData'], function (data) {
		encNotes = data.secpassNotesData
		chrome.storage.local.get(['secpassPassesData'], function (data) {
			encPasses = data.secpassPassesData
			chrome.storage.local.get(['secpassd'], function (data) {
				ik = data.secpassd.ik
				if (ik != undefined) {
					if (encNotes.length == 0 && encPasses.length == 0) {
						$("#mainScreenNothingFound").show()
						$("#searchBarNotePassword").hide()
						progressOff()
					} else {
						$("#mainScreenSomethingFound").show()
						console.log("User Notes: " + encNotes.length)
						console.log("User Passes: " + encPasses.length)
						for (i = 0; i < encPasses.length; i++) {
							var website = escapeOutput(CryptoJS.AES.decrypt(encPasses[i].website, ik).toString(CryptoJS.enc.Utf8))
							var username = escapeOutput(CryptoJS.AES.decrypt(encPasses[i].username, ik).toString(CryptoJS.enc.Utf8))
							var password = escapeOutput(CryptoJS.AES.decrypt(encPasses[i].password, ik).toString(CryptoJS.enc.Utf8))
							var passItem = new LoginItem(website, username, password, i)
							decryptedPasswords.push(passItem)
						}
						arr = [...decryptedPasswords]
						generatePassesReadables(ik, arr.slice(passesRangeTop, passesRangeBottom))
						for (i = 0; i < encNotes.length; i++) {
							var title = escapeOutput(CryptoJS.AES.decrypt(encNotes[i].title, ik).toString(CryptoJS.enc.Utf8))
							var note = escapeOutput(CryptoJS.AES.decrypt(encNotes[i].note, ik).toString(CryptoJS.enc.Utf8))
							var noteItem = new NoteItem(title, note, i)
							decryptedNotes.push(noteItem)
						}
						arrNotes = [...decryptedNotes]
						generateNotesReadables(ik, arrNotes.slice(notesRangeTop, notesRangeBottom))
						progressOff()
					}
				} else {
					progressOff()
				}
			});
		})
	})
}
