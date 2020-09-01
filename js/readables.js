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
				progressOn()
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
						progressOff()
					})
				} else {
					console.log("not searching")
					chrome.storage.local.set({
						'secpassPassesData': userDat
					}, function () {
						//
						console.log("[DEBUG] Editing password in passwords!")
						console.log("editing pass id: "+ind)
						arr = [...decryptedPasswords]
						generatePassesReadables(key, arr.slice(passesRangeTop, passesRangeBottom))
						progressOff()
					})
				}
			})
		})

		$(item).find(".delete-password").dblclick(function() {
			progressOn()
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
					progressOff()
				})
			} else {
				chrome.storage.local.set({
					'secpassPassesData': userDat
				}, function () {
					console.log("[DEBUG] Deleting password from passwords!: " + new Date())
					console.log(userDat)
					arr = [...decryptedPasswords]
					generatePassesReadables(ik, arr.slice(passesRangeTop, passesRangeBottom))
					progressOff()
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
				progressOn()
				var key = ik
				var ind = notes[index].getIndex()
				var titleE = $(item).find(".title").val()
				var noteE = $(item).find(".note").val()
				var encryptedTitle = CryptoJS.AES.encrypt(titleE, key).toString()
				var encryptedNote = CryptoJS.AES.encrypt(noteE, key).toString()
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
						progressOff()
					})
				} else {
					console.log("not searching")
					chrome.storage.local.set({
						'secpassNotesData': userDat
					}, function () {
						console.log("[DEBUG] Editing note in notes!: " + new Date())
						console.log("editing pass id: "+ind)
						generateNotesReadables(key, decryptedNotes)
						progressOff()
					})
				}
			})

		})

		$(item).find(".delete-note").dblclick(function() {
			progressOn()
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
					progressOff()
				})
			} else {
				chrome.storage.local.set({
					'secpassNotesData': userDat
				}, function(){
					console.log("[DEBUG] Deleting note from notes!: " + new Date())
					console.log(userDat)
					arr = [...decryptedNotes]
					generateNotesReadables(ik, arr.slice(notesRangeTop, notesRangeBottom))
					progressOff()
				})
			}
		})
	})
}