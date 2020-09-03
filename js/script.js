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
