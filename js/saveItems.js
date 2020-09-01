function saveSecNote(title, note) {
	if (title != "" && note != "") {
		progressOn()
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
			arr = [...decryptedNotes]
			generateNotesReadables(key, arr.slice(notesRangeTop, notesRangeBottom))
			progressOff()
		});
	} else {
		$("#addSecNoteSubmitError").text("Empty fields!")
	}
}

function saveSecPassword(website, username, password) {
	if (!regexWebsite(website)) {
		$("#addSecPasswordSubmitError").text("Invalid Website URL!")
	} else if (website != "" && username != "" && password != "") {
		progressOn()
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
			arr = [...decryptedPasswords]
			generatePassesReadables(key, arr.slice(passesRangeTop, passesRangeBottom))
			progressOff()
		});
	} else {
		$("#addSecPasswordSubmitError").text("Empty fields!")
	}
}