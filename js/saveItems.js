function saveSecNote(title, note) {
  if (title != "" && note != "") {
    progressOn();
    var key = ik;
    encryptedPayload = {
      title: encrypt(title, key),
      note: encrypt(note, key),
    };
    encNotes.unshift(encryptedPayload);
    decryptedNotes.unshift(new NoteItem(title, note, 0));
    for (i = 1; i < decryptedNotes.length; i++) {
      decryptedNotes[i].setIndex(i);
    }
    chrome.storage.local.set(
      {
        secpassNotesData: encNotes,
      },
      function () {
        passNotesToDataPoint(encNotes);
        console.log("[DEBUG] Adding a note!");
        $("#addSecNoteDialog").css("display", "none");
        if ($("#mainScreenNothingFound").is(":visible")) {
          $("#mainScreenNothingFound").hide();
          $("#mainScreenSomethingFound").show();
          $("#searchBarNotePassword").show();
        }
        generateNotesReadables(
          key,
          [...decryptedNotes].slice(notesRangeTop, notesRangeBottom)
        );
        progressOff();
      }
    );
  } else {
    $("#addSecNoteSubmitError").text("Empty fields!");
  }
}

function saveSecPassword(website, username, password) {
  if (!regexWebsite(website)) {
    $("#addSecPasswordSubmitError").text("Invalid Website URL!");
  } else if (website != "" && username != "" && password != "") {
    progressOn();
    var key = ik;
    encryptedPayload = {
      website: encrypt(website, key),
      username: encrypt(username, key),
      password: encrypt(password, key),
    };
    encPasses.unshift(encryptedPayload);
    decryptedPasswords.unshift(new LoginItem(website, username, password, 0));
    for (i = 1; i < decryptedPasswords.length; i++) {
      decryptedPasswords[i].setIndex(i);
    }
    chrome.storage.local.set(
      {
        secpassPassesData: encPasses,
      },
      function () {
        passLoginsToDataPoint(encPasses);
        console.log("[DEBUG] Adding a password!");
        $("#addSecPasswordDialog").css("display", "none");
        if ($("#mainScreenNothingFound").is(":visible")) {
          $("#mainScreenNothingFound").hide();
          $("#mainScreenSomethingFound").show();
          $("#searchBarNotePassword").show();
        }
        generatePassesReadables(
          key,
          [...decryptedPasswords].slice(passesRangeTop, passesRangeBottom)
        );
        progressOff();
      }
    );
  } else {
    $("#addSecPasswordSubmitError").text("Empty fields!");
  }
}
