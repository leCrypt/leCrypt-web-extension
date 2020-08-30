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
			var title = arr[i].title.toLowerCase();
			var note = arr[i].note.toLowerCase();
			return title.includes(search) || note.includes(search)
		})
		generateNotesReadables(ik, filteredNotes, true)
		filteredPassword = decryptedPasswords.filter(function (value, i, arr) {
			var website = arr[i].website.toLowerCase();
			var username = arr[i].username.toLowerCase();
			return website.includes(search) || username.includes(search)
		})
		generatePassesReadables(ik, filteredPassword, true)
	}
})

$("#searchBarNotePasswordInput").on("input", function () {
	var search = $("#searchBarNotePasswordInput").val().toLowerCase()
	if (search != "") {
		searching = true
	} else {
		generateNotesReadables(ik, decryptedNotes, true)
		generatePassesReadables(ik, decryptedPasswords, true)
		searching = false;
	}
})

function byteArrayToString(byteArray) {
	var str = "",
		i;
	for (i = 0; i < byteArray.length; ++i) {
		str += escape(String.fromCharCode(byteArray[i]))
	}
	return str
}

function escapeOutput(toOutput) {
	return toOutput.replace(/\&/g, '&')
		.replace(/\</g, '<')
		.replace(/\>/g, '>')
		.replace(/\"/g, '"')
		.replace(/\'/g, ''')
}

function noteItemGive(title, note) {
	var noteItem = '<div class="notesItem" style="border-style: solid; border-color: black; border-width: 4px; border-radius: 5px; font-size: medium; margin: 0.5em; padding-left: 2%; padding-bottom: 2%; background-color: white; color: black;">' +
		' <li>' +
		' <div class="notes-header" style="display: flex; justify-content: space-between;">' +
		'   <span style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: bold; font-size: 24px; margin-right: 2%; display: inline-block; word-break: break-word;" class="notetitle">' + title + '</span>' +
		'   <div class="smallboxes edit-note"><i class="fas fa-pen"></i></div>' +
		' </div>' +
		'   <div style="width:80%; border: 2px solid #6c63ff; border-radius: 50px;"></div>' +
		'   <p class="note" style="padding: 0px; margin: 0px; margin-right: 2%; display: inline-block; word-break: break-word;">' + note + '</p>' +
		' </li>' +
		'</div>'
	return noteItem
}

function passItemGive(website, username, password) {
	var passItem = '<div class="passesItem" style="border-style: solid; border-color: black; border-width: 4px; border-radius: 5px; font-size: medium; margin: 0.5em; padding-left: 2%; padding-bottom: 2%; background-color: white; color: black;">' +
		' <li>' +
		'   <div class="password-header" style="display: flex; justify-content: space-between;">' +
		'     <span class="website" style="margin-top: 2%; margin-bottom: 2%; margin-left: 1%; width: 85%; font-weight: bold; font-size: 16px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">' + website + '</span>' +
		'     <div class="smallboxes edit-password"><i class="fas fa-pen"></i></div>' +
		'   </div>' +
		'   <div style="width:80%; border: 2px solid #6c63ff; border-radius: 50px;"></div>' +
		'   <p class="username" style="font-size: large; margin: 1%; display: inline-block; word-break: break-word;">' + username + '</p>' +
		'   <div class="password-group" style="margin:1%;">' +
		'   <div>' +
		'     <input readonly class="form-control password-box" aria-label="password" type="password" style="vertical-align: middle; width:73%; margin: 0px; margin-right: 2%; border-style: solid; border-radius: 4px; border-color: black; border-width: 2px; font-size: large; box-shadow: 0px 0px;" value="' + password + '">' +
		'     <span style="font-size: x-large; vertical-align: middle; margin-bottom: 3px;" class="clipper tooltip"><b><i class="far fa-clipboard"></i></b><span class="tooltiptext">copy</span></span>' +
		'     <input type="checkbox" class="password-visibility" style="width: 28px; height: 28px; margin-left: 2%; vertical-align: middle; box-shadow: 0px 0px;">' +
		'   </div>' +
		'   </div>' +
		' </li>' +
		'</div>'
	return passItem
}

function generatePassesReadables(ik, passes, append) {
	$("#passes-list").empty()

	if (append) {
		for (i = 0; i < passes.length; i++) {
			var website = passes[i].website
			var username = passes[i].username
			var password = passes[i].password
			$("#passes-list").append(passItemGive(website, username, password))
		}
	}

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

	})

	$(".password-header").find(".edit-password").each(function (index, div) {

		var $div = $(div)
		$div.click(function () {
			$("#addSecPasswordDialog").css("display", "block")
			$("#addSecPasswordDialogTitle").text("Edit Password")
			var website = passes[index].website
			var username = passes[index].username
			var password = passes[index].password
			$("#addSecPasswordInputWebsite").val(website)
			$("#addSecPasswordInputUsername").val(username)
			$("#addSecPasswordInputPassword").val(password)
			$("#addSecPasswordSubmitError").val("")
			$("#addSecPasswordSaveBtn").hide()
			$("#saveEditPasswordBtn").show()
			$("#deleteEditPasswordBtn").show()

			$("#saveEditPasswordBtn").click(function () {
				var key = ik;
				var webE = $("#addSecPasswordInputWebsite").val()
				var usrE = $("#addSecPasswordInputUsername").val()
				var passE = $("#addSecPasswordInputPassword").val()
				var encryptedWebsite = CryptoJS.AES.encrypt(webE, key).toString();
				var encryptedUsername = CryptoJS.AES.encrypt(usrE, key).toString();
				var encryptedPassword = CryptoJS.AES.encrypt(passE, key).toString();
				encryptedPayload = {
					"website": encryptedWebsite,
					"username": encryptedUsername,
					"password": encryptedPassword
				}
				var userDat = encPasses
				userDat[index] = encryptedPayload
				passes[index] = encryptedPayload
				decryptedPasswords[index] = {
					website: website,
					username: username,
					password: password
				}

				if (searching) {
					console.log("searching")
					var search = $("#searchBarNotePasswordInput").val()
					filteredPassword = decryptedPasswords.filter(function (value, i, arr) {
						var website = arr[i].website.toLowerCase();
						var username = arr[i].username.toLowerCase();
						return website.includes(search) || username.includes(search)
					})
					chrome.storage.local.set({
						'secpassPassesData': userDat
					}, function () {
						console.log("[DEBUG] Editing password in passwords!")
						console.log(userDat)
						$("#addSecPasswordInputWebsite").val("")
						$("#addSecPasswordInputUsername").val("")
						$("#addSecPasswordInputPassword").val("")
						$("#addSecPasswordDialog").css("display", "none")
						generatePassesReadables(key, filteredPassword)
					})
				} else {
					console.log("not searching")
					chrome.storage.local.set({
						'secpassPassesData': userDat
					}, function () {
						console.log("[DEBUG] Editing password in passwords!")
						console.log(userDat)
						$("#addSecPasswordInputWebsite").val("")
						$("#addSecPasswordInputUsername").val("")
						$("#addSecPasswordInputPassword").val("")
						$("#addSecPasswordDialog").css("display", "none")
						generatePassesReadables(key, decryptedPasswords)
					})
				}
			})

			$("#deleteEditPasswordBtn").click(function () {
				var userDat = encPasses.filter(function (value, i, arr) {
					return i != index;
				});
				chrome.storage.local.set({
					'secpassPassesData': userDat
				}, function () {
					console.log("[DEBUG] Deleting password from passwords!: " + new Date())
					console.log(userDat)
					$("#addSecPasswordInputWebsite").val("")
					$("#addSecPasswordInputUsername").val("")
					$("#addSecPasswordInputPassword").val("")
					$("#addSecPasswordDialog").css("display", "none")
					generatePassesReadables(ik, decryptedPasswords.filter(function (value, i, arr) {
						return i != index;
					}))
				})
			})

		})
	})
}

function generateNotesReadables(ik, notes, append) {
	$("#notes-list").empty()

	if (append) {
		for (i = 0; i < notes.length; i++) {
			var title = notes[i].title
			var note = notes[i].note
			$("#notes-list").append(noteItemGive(title, note))
		}
	}

	$(".notes-header").find(".edit-note").each(function (index, div) {
		var $div = $(div)
		$div.click(function () {
			$("#addSecNoteDialog").css("display", "block")
			$("#addSecNoteDialogTitle").text("Edit Note")
			var title = notes[index].title
			var note = notes[index].note
			$("#addSecNoteInputTitle").val(title)
			$("#addSecNoteInputTextArea").val(note)
			$("#addSecNoteSubmitError").val("")
			$("#addSecNoteSaveBtn").hide()
			$("#saveEditNoteBtn").show()
			$("#deleteEditNoteBtn").show()

			$("#saveEditNoteBtn").click(function () {
				var key = ik
				var title = $("#addSecNoteInputTitle").val()
				var note = $("#addSecNoteInputTextArea").val()
				var encryptedTitle = CryptoJS.AES.encrypt(title, key).toString()
				var encryptedNote = CryptoJS.AES.encrypt(note, key).toString()
				encryptedPayload = {
					"title": encryptedTitle,
					"note": encryptedNote
				}
				var userDat = encNotes
				userDat[index] = encryptedPayload
				notes[index] = encryptedPayload
				decryptedNotes[index] = {
					title: title,
					note: note
				}
				var search = $("#searchBarNotePasswordInput").val()
				filteredNotes = decryptedNotes.filter(function (value, i, arr) {
					var title = arr[i].title.toLowerCase();
					var note = arr[i].note.toLowerCase();

					return title.includes(search) || note.includes(search)
				})
				chrome.storage.local.set({
					'secpassNotesData': userDat
				}, function () {
					console.log("[DEBUG] Editing note in notes!: " + new Date())
					console.log(userDat)
					$("#addSecNoteInputTitle").val("")
					$("#addSecNoteInputTextArea").val("")
					$("#addSecNoteDialog").css("display", "none")

					generateNotesReadables(key, filteredNotes, true)
				})
			})

			$("#deleteEditNoteBtn").click(function () {
				var arr = encNotes.filter(function (value, i, arr) {
					return i != index;
				});
				chrome.storage.local.set({
					'secpassNotesData': arr
				}, function () {
					console.log("[DEBUG] Deleting note in notes!: " + new Date())
					console.log(arr)
					$("#addSecNoteInputTitle").val("")
					$("#addSecNoteInputTextArea").val("")
					$("#addSecNoteDialog").css("display", "none")

					generateNotesReadables(ik, decryptedNotes.filter(function (value, i, arr) {
						return i != index;
					}), true)
				})

			})
			console.log(index)
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
						console.log("notes: " + encNotes.length)
						console.log("passes: " + encPasses.length)
						for (i = 0; i < encPasses.length; i++) {
							console.log(i)
							var website = escapeOutput(CryptoJS.AES.decrypt(encPasses[i].website, ik).toString(CryptoJS.enc.Utf8))
							var username = escapeOutput(CryptoJS.AES.decrypt(encPasses[i].username, ik).toString(CryptoJS.enc.Utf8))
							var password = escapeOutput(CryptoJS.AES.decrypt(encPasses[i].password, ik).toString(CryptoJS.enc.Utf8))
							userData = {
								website: website,
								username: username,
								password: password
							}
							decryptedPasswords.push(userData)
						}
						generatePassesReadables(ik, decryptedPasswords, true)
						for (i = 0; i < encNotes.length; i++) {
							var title = escapeOutput(CryptoJS.AES.decrypt(encNotes[i].title, ik).toString(CryptoJS.enc.Utf8))
							var note = escapeOutput(CryptoJS.AES.decrypt(encNotes[i].note, ik).toString(CryptoJS.enc.Utf8))
							userData = {
								title: title,
								note: note
							}
							decryptedNotes.push(userData)
						}
						generateNotesReadables(ik, decryptedNotes, true)
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
		decryptedNotes.unshift({
			title: title,
			note: note
		})
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
			}
			generateNotesReadables(key, decryptedNotes, true)
		});
	} else {
		$("#addSecNoteSubmitError").text("Empty fields!")
	}
}

function saveSecPassword(website, username, password) {
	if (!regexUsername(website)) {
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
		decryptedPasswords.unshift({
			website: website,
			username: username,
			password: password
		})
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
			}
			generatePassesReadables(key, decryptedPasswords)
		});
	} else {
		$("#addSecPasswordSubmitError").text("Empty fields!")
	}
}

function regexUsername(inp) {
	return /^(https?):\/\/[^\s$.?#].[^\s]*$/i.test(inp);
}
