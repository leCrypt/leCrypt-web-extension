var addSecNoteButton = document.getElementById('addSecNote');
var addSecNoteDialog = document.getElementById('addSecNoteDialog');

var addSecPasswordButton = document.getElementById('addSecPassword');
var addSecPasswordDialog = document.getElementById('addSecPasswordDialog');

addSecNoteButton.addEventListener('click', function onOpen() {
  if (typeof addSecNoteDialog.showModal === "function") {
    $("#addSecNoteDialog").css("display", "block")
  } else {
    alert("The <dialog> API is not supported by this browser");
  }
});

addSecPasswordButton.addEventListener('click', function onOpen() {
    if (typeof addSecNoteDialog.showModal === "function") {
      $("#addSecPasswordDialog").css("display", "block")
    } else {
      alert("The <dialog> API is not supported by this browser");
    }
});

function byteArrayToString(byteArray) {
  var str = "", i;
  for (i = 0; i < byteArray.length; ++i) {
      str += escape(String.fromCharCode(byteArray[i]));
  }
  return str;
}

function loadUserData(){
  console.log("[DEBUG] Starting to load user data!")
  chrome.storage.local.get(['secpassNotesData'], function(data){
    var notes = data.secpassNotesData
    chrome.storage.local.get(['secpassPassesData'], function(data){
      var passes = data.secpassPassesData
      chrome.storage.local.get(['secpassd'], function(data){
        var ik = data.secpassd.ik
        if(ik!=undefined){
          if(notes.length==0&&passes.length==0){
            $("#mainScreenNothingFound").show()
          } else {
            var noteItem= '<div style="border-style: solid; border-color: black; border-width: 4px; font-size: medium; margin: 0.5em; padding: 2%; background-color: white; color: black;">'
                        + '  <li>'
                        + '   <h2 style="font-weight: bold; font-size: 24px;" class="notetitle"></h2>'
                        + '   <div style="width:80%; border: 2px solid #a883f8;"></div>'
                        + '   <p class="note" style="padding: 0px; margin: 0px;"></p>'
                        + ' </li>'
                        + '</div>'

            var notesOptions = {
              valueNames: [ 'notetitle', 'note' ],
              item: noteItem
            };
            
            var notesValues = [];
            for(i=0; i<notes.length;i++){
              var title = CryptoJS.AES.decrypt(notes[i].title, ik).toString(CryptoJS.enc.Utf8);
              var note = CryptoJS.AES.decrypt(notes[i].note, ik).toString(CryptoJS.enc.Utf8);
              notesValues.push({
                notetitle: title,
                note: note
              });
            }
            var notesList = new List('notes-list', notesOptions, notesValues);
            
            var passesOptions = {
              valueNames: [ 'website', 'username', 'password' ],
              item: '<li><h2 class="website"></h3><p class="username"></p><p class="password"></p></li>'
            };
            var passesValues = [];
            for(i=0; i<passes.length;i++){
              var website = CryptoJS.AES.decrypt(passes[i].website, ik).toString(CryptoJS.enc.Utf8);
              var username = CryptoJS.AES.decrypt(passes[i].username, ik).toString(CryptoJS.enc.Utf8);
              var password = CryptoJS.AES.decrypt(passes[i].password, ik).toString(CryptoJS.enc.Utf8);
              passesValues.push({
                website: website,
                username: username,
                password: password
              });
            }
            var passesList = new List('passes-list', passesOptions, passesValues);
            
            $("#mainScreenSomethingFound").show()
          }
        }
      });
    })
  })
}

function saveSecNote(title, note){
  if(title!=""&&note!=""){
    chrome.storage.local.get(['secpassd'], function(data){
      var key = data.secpassd.ik;
      var encryptedTitle = CryptoJS.AES.encrypt(title, key).toString();
      var encryptedNote = CryptoJS.AES.encrypt(note, key).toString();
      encryptedPayload = {
        "title": encryptedTitle,
        "note": encryptedNote
      }
      chrome.storage.local.get(['secpassNotesData'], function(data){
        var notesArray = data.secpassNotesData;
        notesArray.push(encryptedPayload)
        chrome.storage.local.set({'secpassNotesData': notesArray}, function(){
          console.log("[DEBUG] Adding note to notes!")
          console.log(notesArray)
          $("#addSecNoteInputTitle").text("");
          $("#addSecNoteInputTextArea").text("")
          $("#addSecNoteDialog").css("display", "none")
        });
      });
    });
  } else {
    $("#addSecNoteSubmitError").text("Empty fields!")
  }
}

function saveSecPassword(website, username, password){
  if(website!=""&&username!=""&&password!=""){
    chrome.storage.local.get(['secpassd'], function(data){
      var key = data.secpassd.ik;
      var encryptedWebsite = CryptoJS.AES.encrypt(website, key).toString();
      var encryptedUsername = CryptoJS.AES.encrypt(username, key).toString();
      var encryptedPassword = CryptoJS.AES.encrypt(password, key).toString();
      encryptedPayload = {
        "website": encryptedWebsite,
        "username": encryptedUsername,
        "password": encryptedPassword
      }
      chrome.storage.local.get(['secpassPassesData'], function(data){
        var passesArray = data.secpassPassesData;
        passesArray.push(encryptedPayload)
        chrome.storage.local.set({'secpassPassesData': passesArray}, function(){
          console.log("[DEBUG] Adding password to passwords!")
          console.log(passesArray)
          $("#addSecPasswordInputWebsite").text("")
          $("#addSecPasswordInputUsername").text("")
          $("#addSecPasswordInputPassword").text("")
          $("#addSecPasswordDialog").css("display", "none")
        });
      });
    });
  } else {
    $("#addSecPasswordSubmitError").text("Empty fields!")
  }
}
