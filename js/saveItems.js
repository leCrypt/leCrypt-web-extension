function saveSecNote(title, note) {
	if (title != "" && note != "") {
		progressOn()
		var key = ik
		encryptedPayload = {
			"title": CryptoJS.AES.encrypt(title, key).toString(),
			"note": CryptoJS.AES.encrypt(note, key).toString()
		}
		encNotes.unshift(encryptedPayload)
		decryptedNotes.unshift(new NoteItem(title, note, 0))
		for(i=1;i<decryptedNotes.length;i++){
			decryptedNotes[i].setIndex(i)
		}
		chrome.storage.local.set({
			'secpassNotesData': encNotes
		}, function () {
			passNotesToDataPoint(encNotes)
			console.log("[DEBUG] Adding a note!")
			$("#addSecNoteDialog").css("display", "none")
			if ($("#mainScreenNothingFound").is(":visible")) {
				$("#mainScreenNothingFound").hide()
				$("#mainScreenSomethingFound").show()
				$("#searchBarNotePassword").show()
			}
			generateNotesReadables(key, [...decryptedNotes].slice(notesRangeTop, notesRangeBottom))
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
		encryptedPayload = {
			"website": CryptoJS.AES.encrypt(website, key).toString(),
			"username": CryptoJS.AES.encrypt(username, key).toString(),
			"password": CryptoJS.AES.encrypt(password, key).toString()
		}
		encPasses.unshift(encryptedPayload)
		decryptedPasswords.unshift(new LoginItem(website, username, password, 0))
		for(i=1;i<decryptedPasswords.length;i++){
			decryptedPasswords[i].setIndex(i)
		}
		chrome.storage.local.set({
			'secpassPassesData': encPasses
		}, function () {
			passLoginsToDataPoint(encPasses)
			console.log("[DEBUG] Adding a password!")
			$("#addSecPasswordDialog").css("display", "none")
			if ($("#mainScreenNothingFound").is(":visible")) {
				$("#mainScreenNothingFound").hide()
				$("#mainScreenSomethingFound").show()
				$("#searchBarNotePassword").show()
			}
			generatePassesReadables(key, [...decryptedPasswords].slice(passesRangeTop, passesRangeBottom))
			progressOff()
		});
	} else {
		$("#addSecPasswordSubmitError").text("Empty fields!")
	}
}