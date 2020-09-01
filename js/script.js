var addSecNoteButton = document.getElementById('addSecNote')
var addSecNoteDialog = document.getElementById('addSecNoteDialog')

var addSecPasswordButton = document.getElementById('addSecPassword')
var addSecPasswordDialog = document.getElementById('addSecPasswordDialog')

var decryptedPasswords = []
var decryptedNotes = []

var encNotes = null
var encPasses = null

var ik = null

var searching = false

//you fucking retard add a delytion button because delytion go brrrrrr no matter what
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

// //todo if the <0 thing
$('#passesListDiv').scroll(function () {
	if (this.scrollTop == (this.scrollHeight - this.offsetHeight)) {
		if (passesRangeBottom + 3 < passes.length) {
			console.log("passes list bottom reached!")
		}
	} else if (this.scrollTop == 0) {
		if (passesRangeTop != 0) {
			console.log("passes list top reached!")
		}
	}
})

$('#notesListDiv').scroll(function () {
	if (this.scrollTop == (this.scrollHeight - this.offsetHeight)) {
		if (notesRangeBottom + 3 < notes.length) {
			console.log("notes list bottom reached!")
		}
	} else if (this.scrollTop == 0) {
		if (notesRangeTop != 0) {
			console.log("notes list top reached!")
		}
	}
})
//todo if the <0 thing

$("#searchBarNotePasswordSubmit").click(function () {
	//todo improve the search algorithm
	var search = $("#searchBarNotePasswordInput").val().toLowerCase()

	if (ik != undefined) {
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
	}
})

$("#searchBarNotePasswordInput").on("input", function () {
	var search = $("#searchBarNotePasswordInput").val().toLowerCase()
	if (search != "") {
		searching = true
	} else {
		generateNotesReadables(ik, decryptedNotes)
		generatePassesReadables(ik, decryptedPasswords)
		searching = false;
	}
})

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

function generatePassesReadables(ik, passes) {
	$("#passes-list").empty()

	console.log("=============================")
	for (i = 0; i < passes.length; i++) {
		var website = passes[i].getWebsite()
		var username = passes[i].getUsername()
		console.log("username: "+username)
		var password = passes[i].getPassword()
		$("#passes-list").append(passItemGive(website, username, password))
		console.log("pass index: "+passes[i].getIndex())
	}
	console.log("=============================")

	$(".passesItem").find('li').each(function (index, item) {
		var $input = $(item).find('.password-box');
		$input.parent().find('.password-visibility').click(function () {
			if ($input.attr('type') == "password") {
				$input.attr('type', "text")
			} else {
				$input.attr('type', "password")
			}
		});

		var clipper = $(item).find('.clipper');
		$(clipper).click(function () {
			if (!$(clipper).parent().find('.password-visibility').is(":checked")) {
				$(clipper).parent().find('.password-box').attr('type', "text")
				$(clipper).parent().find('.password-box').select()
				document.execCommand("copy")
				$(clipper).parent().find('.password-box').attr('type', "password")
				$(clipper).find('.tooltiptext').text("copied!")
				setTimeout(function () {
					$(clipper).find('.tooltiptext').text("copy")
				}, 600)
			} else {
				$(clipper).parent().find('.password-box').select()
				document.execCommand("copy")
				$(clipper).find('.tooltiptext').text("copied!")
				setTimeout(function () {
					$(clipper).find('.tooltiptext').text("copy")
				}, 600)
			}
		})

		$(item).find(".edit-password").click(function () {
			var website = passes[index].getWebsite()
			var username = passes[index].getUsername()
			var password = passes[index].getPassword()
			
			$(item).find(".edit-password").css("display", "none")
			$(item).find(".save-password").css("display", "block")

			var websiteInput = $(item).find(".website");
			websiteInput.attr('readonly', false)
			websiteInput.focus()
			websiteInput.val(website)
			websiteInput.css("background-color","#e8f0fe");
			var usernameInput = $(item).find(".username")
			usernameInput.attr('readonly', false)
			usernameInput.val(username)
			usernameInput.css("background-color","#e8f0fe");
			var passwordInput = $(item).find(".password-box")
			passwordInput.attr('readonly', false)
			passwordInput.val(password)
			passwordInput.css("background-color","#e8f0fe");

			$(item).find(".save-password").click(function () {
				var key = ik;
				var ind = passes[index].getIndex()
				console.log("ind: "+ind)
				var webE = $(item).find(".website").val()
				var usrE = $(item).find(".username").val()
				var passE = $(item).find(".password-box").val()
				console.log(webE)
				var encryptedWebsite = CryptoJS.AES.encrypt(webE, key).toString();
				var encryptedUsername = CryptoJS.AES.encrypt(usrE, key).toString();
				var encryptedPassword = CryptoJS.AES.encrypt(passE, key).toString();
				encryptedPayload = {
					"website": encryptedWebsite,
					"username": encryptedUsername,
					"password": encryptedPassword
				}
				var userDat = encPasses
				userDat[ind] = encryptedPayload
				encPasses = userDat
				decryptedPasswords[ind] = new LoginItem(webE, usrE, passE, ind)

				if (searching) {
					console.log("searching")
					var search = $("#searchBarNotePasswordInput").val()
					filteredPassword = decryptedPasswords.filter(function (value, i, arr) {
						var website = arr[i].getWebsite().toLowerCase();
						var username = arr[i].getUsername().toLowerCase();
						return website.includes(search) || username.includes(search)
					})
					chrome.storage.local.set({
						'secpassPassesData': userDat
					}, function () {
						//
						console.log("[DEBUG] Editing password in passwords!")
						console.log(userDat)
						generatePassesReadables(key, filteredPassword)
					})
				} else {
					console.log("not searching")
					chrome.storage.local.set({
						'secpassPassesData': userDat
					}, function () {
						//
						console.log("[DEBUG] Editing password in passwords!")
						console.log("editing pass id: "+ind)
						generatePassesReadables(key, decryptedPasswords)
					})
				}
			})
		})

		$(item).find(".delete-password").dblclick(function() {
			var ind = passes[index].getIndex()
			console.log("ind: "+ind)
			console.log("index: "+index)
			encPasses = encPasses.filter(function (value, i, arr) {
				return i != ind;
			});
			var userDat = encPasses
			decryptedPasswords = decryptedPasswords.filter(function (value, i, arr) {
				return i != ind;
			})
			for(i=ind;i<decryptedPasswords.length;i++){
				decryptedPasswords[i].setIndex(i)
			}
			if (searching) {
				filteredPassword = passes.filter(function(value, i, arr){
					return i!=index
				})
				chrome.storage.local.set({
					'secpassPassesData': userDat
				}, function () {
					console.log("[DEBUG] Deleting password from passwords!: " + new Date())
					console.log(userDat)
					generatePassesReadables(ik, filteredPassword)
				})
			} else {
				chrome.storage.local.set({
					'secpassPassesData': userDat
				}, function () {
					console.log("[DEBUG] Deleting password from passwords!: " + new Date())
					console.log(userDat)
					generatePassesReadables(ik, decryptedPasswords)
				})
			}
		})

	})
}

function generateNotesReadables(ik, notes) {
	$("#notes-list").empty()

	console.log("=============================")
	for (i = 0; i < notes.length; i++) {
		var title = notes[i].getTitle()
		var note = notes[i].getNote()
		console.log("title: "+title)
		$("#notes-list").append(noteItemGive(title, note))
		console.log("note index: "+notes[i].getIndex())
	}
	console.log("=============================")

	$(".notesItem").find('li').each(function (index, item) {
		
		$(item).find(".edit-note").click(function () {
			var title = notes[index].getTitle()
			var note = notes[index].getNote()

			$(item).find(".edit-note").css("display", "none")
			$(item).find(".save-note").css("display", "block")

			var titleInput = $(item).find(".title");
			titleInput.attr('readonly', false)
			titleInput.focus()
			titleInput.val(title)
			titleInput.css("background-color","#e8f0fe");
			var noteInput = $(item).find(".note")
			noteInput.attr('readonly', false)
			noteInput.val(note)
			noteInput.css("background-color","#e8f0fe");

			$(item).find(".save-note").click(function() {
				var key = ik
				var ind = notes[index].getIndex()
				var titleE = $(item).find(".title").val()
				var noteE = $(item).find(".note").val()
				var encryptedTitle = CryptoJS.AES.encrypt(title, key).toString()
				var encryptedNote = CryptoJS.AES.encrypt(note, key).toString()
				encryptedPayload = {
					"title": encryptedTitle,
					"note": encryptedNote
				}
				var userDat = encNotes
				userDat[ind] = encryptedPayload
				encNotes = userDat
				decryptedNotes[ind] = new NoteItem(titleE, noteE, ind)

				if(searching){
					console.log("Searching")
					var search = $("#searchBarNotePasswordInput").val()
					filteredNotes = decryptedNotes.filter(function (value, i, arr) {
						var title = arr[i].getTitle().toLowerCase();
						var note = arr[i].getNote().toLowerCase();
	
						return title.includes(search) || note.includes(search)
					})
					chrome.storage.local.set({
						'secpassNotesData': userDat
					}, function () {
						console.log("[DEBUG] Editing note in notes!: " + new Date())
						console.log(userDat)
						generateNotesReadables(key, filteredNotes)
					})
				} else {
					console.log("not searching")
					chrome.storage.local.set({
						'secpassNotesData': userDat
					}, function () {
						console.log("[DEBUG] Editing note in notes!: " + new Date())
						console.log("editing pass id: "+ind)
						generateNotesReadables(key, decryptedNotes)
					})
				}
			})

		})

		$(item).find(".delete-note").dblclick(function() {
			var ind = notes[index].getIndex()
			console.log("ind: "+ind)
			console.log("index: "+index)
			encNotes = encNotes.filter(function (value, i, arr){
				return i!=ind
			})
			var userDat = encNotes
			decryptedNotes = decryptedNotes.filter(function (value, i, arr){
				return i !=ind
			})
			for(i=ind;i<decryptedNotes.length;i++){
				decryptedNotes[i].setIndex(i)
			}
			if(searching){
				filteredNotes = notes.filter(function (value, i, arr){
					return i!=index
				})
				chrome.storage.local.set({
					'secpassNotesData': userDat
				}, function(){
					console.log("[DEBUG] Deleting note from notes!: " + new Date())
					console.log(userDat)
					generateNotesReadables(ik, filteredNotes)
				})
			} else {
				chrome.storage.local.set({
					'secpassNotesData': userDat
				}, function(){
					console.log("[DEBUG] Deleting note from notes!: " + new Date())
					console.log(userDat)
					generateNotesReadables(ik, decryptedNotes)
				})
			}

		})

	})

}

function loadUserData() {
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
					} else {
						console.log("User Notes: " + encNotes.length)
						console.log("User Passes: " + encPasses.length)
						for (i = 0; i < encPasses.length; i++) {
							var website = escapeOutput(CryptoJS.AES.decrypt(encPasses[i].website, ik).toString(CryptoJS.enc.Utf8))
							var username = escapeOutput(CryptoJS.AES.decrypt(encPasses[i].username, ik).toString(CryptoJS.enc.Utf8))
							var password = escapeOutput(CryptoJS.AES.decrypt(encPasses[i].password, ik).toString(CryptoJS.enc.Utf8))
							var passItem = new LoginItem(website, username, password, i)
							decryptedPasswords.push(passItem)
						}
						generatePassesReadables(ik, decryptedPasswords)
						for (i = 0; i < encNotes.length; i++) {
							var title = escapeOutput(CryptoJS.AES.decrypt(encNotes[i].title, ik).toString(CryptoJS.enc.Utf8))
							var note = escapeOutput(CryptoJS.AES.decrypt(encNotes[i].note, ik).toString(CryptoJS.enc.Utf8))
							var noteItem = new NoteItem(title, note, i)
							decryptedNotes.push(noteItem)
						}
						generateNotesReadables(ik, decryptedNotes)
						$("#mainScreenSomethingFound").show()
					}
				}
			});
		})
	})
}

function saveSecNote(title, note) {
	if (title != "" && note != "") {
		var key = ik
		var encryptedTitle = CryptoJS.AES.encrypt(title, key).toString();
		var encryptedNote = CryptoJS.AES.encrypt(note, key).toString();
		encryptedPayload = {
			"title": encryptedTitle,
			"note": encryptedNote
		}
		var notesArray = encNotes;
		notesArray.unshift(encryptedPayload)
		encNotes = notesArray
		decryptedNotes.unshift(new NoteItem(title, note, 0))
		for(i=1;i<decryptedNotes.length;i++){
			decryptedNotes[i].setIndex(i)
		}
		chrome.storage.local.set({
			'secpassNotesData': notesArray
		}, function () {
			console.log("[DEBUG] Adding note to notes!")
			console.log(notesArray)
			$("#addSecNoteInputTitle").val("")
			$("#addSecNoteInputTextArea").val("")
			$("#addSecNoteDialog").css("display", "none")
			if ($("#mainScreenNothingFound").is(":visible")) {
				$("#mainScreenNothingFound").hide()
				$("#mainScreenSomethingFound").show()
				$("#searchBarNotePassword").show()
			}
			generateNotesReadables(key, decryptedNotes)
		});
	} else {
		$("#addSecNoteSubmitError").text("Empty fields!")
	}
}

function saveSecPassword(website, username, password) {
	if (!regexWebsite(website)) {
		$("#addSecPasswordSubmitError").text("Invalid Website URL!")
	} else if (website != "" && username != "" && password != "") {
		var key = ik;
		var encryptedWebsite = CryptoJS.AES.encrypt(website, key).toString();
		var encryptedUsername = CryptoJS.AES.encrypt(username, key).toString();
		var encryptedPassword = CryptoJS.AES.encrypt(password, key).toString();
		encryptedPayload = {
			"website": encryptedWebsite,
			"username": encryptedUsername,
			"password": encryptedPassword
		}
		var passesArray = encPasses;
		passesArray.unshift(encryptedPayload)
		encPasses = passesArray
		decryptedPasswords.unshift(new LoginItem(website, username, password, 0))
		for(i=1;i<decryptedPasswords.length;i++){
			decryptedPasswords[i].setIndex(i)
		}
		chrome.storage.local.set({
			'secpassPassesData': passesArray
		}, function () {
			console.log("[DEBUG] Adding password to passwords!")
			console.log(passesArray)
			$("#addSecPasswordInputWebsite").val("")
			$("#addSecPasswordInputUsername").val("")
			$("#addSecPasswordInputPassword").val("")
			$("#addSecPasswordDialog").css("display", "none")
			if ($("#mainScreenNothingFound").is(":visible")) {
				$("#mainScreenNothingFound").hide()
				$("#mainScreenSomethingFound").show()
				$("#searchBarNotePassword").show()
			}
			generatePassesReadables(key, decryptedPasswords)
		});
	} else {
		$("#addSecPasswordSubmitError").text("Empty fields!")
	}
}

function regexWebsite(inp) {
	return /^(https?):\/\/[^\s$.?#].[^\s]*$/i.test(inp);
}
