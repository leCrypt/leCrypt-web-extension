var addSecNoteButton = document.getElementById('addSecNote');
var addSecNoteDialog = document.getElementById('addSecNoteDialog');

var addSecPasswordButton = document.getElementById('addSecPassword');
var addSecPasswordDialog = document.getElementById('addSecPasswordDialog');

var passesValues = [];

var notesValues = [];

var passesList;

var notesList;

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

function escapeOutput(toOutput){
  return toOutput.replace(/\&/g, '&amp;')
      .replace(/\</g, '&lt;')
      .replace(/\>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/\'/g, '&#x27')
      .replace(/\//g, '&#x2F');
}

function noteItemGive(title, note){
  var noteItem= '<div style="border-style: solid; border-color: black; border-width: 4px; border-radius: 5px; font-size: medium; margin: 0.5em; padding-left: 2%; padding-bottom: 2%; background-color: white; color: black;">'
              + ' <li>'
              + '   <span style="font-weight: bold; font-size: 24px; margin-right: 2%; display: inline-block; word-break: break-word;" class="notetitle">'+title+'</span>'
              + '   <div style="width:80%; border: 2px solid #6c63ff; border-radius: 50px;"></div>'
              + '   <p class="note" style="padding: 0px; margin: 0px; margin-right: 2%; display: inline-block; word-break: break-word;">'+note+'</p>'
              + ' </li>'
              + '</div>'
  return noteItem
}

function passItemGive(website, username, password, id){
  var passItem= '<div style="border-style: solid; border-color: black; border-width: 4px; border-radius: 5px; font-size: medium; margin: 0.5em; padding-left: 2%; padding-bottom: 2%; background-color: white; color: black;">'
              + ' <li>'
              + '   <i class="fa fa-globe" aria-hidden="true" style="margin-left: 1%;"></i> <span class="website" style="margin:2%; font-weight: bold; font-size: 16px; display: inline-block; word-break: break-word;">'+website+'</span>'
              + '   <div style="width:80%; border: 2px solid #6c63ff; border-radius: 50px;"></div>'
              + '   <i class="fa fa-user" aria-hidden="true" style="margin-left: 1%;"></i> <p class="username" style="font-size: large; margin: 1%; display: inline-block; word-break: break-word;">'+username+'</p>'
              + '   <div class="password-group" style="margin:1%;">'
              + '     <input readonly id="passInput'+id+'" class="form-control password-box" aria-label="password" type="password" style="vertical-align: middle; width:80%; margin: 0px; margin-right: 3.5%; border-style: solid; border-color: black; border-width: 2px; font-size: large; box-shadow: 0px 0px;" value="'+password+'">'
              + '     <input type="checkbox" class="password-visibility" style="width: 28px; height: 28px; vertical-align: middle; box-shadow: 0px 0px; ">'              
              + '   </div>'
              + ' </li>'
              + '</div>'
  return passItem;
}

function generateReadables(){
  $('.password-group').find('.password-box').each(function(index, input) {
    var $input = $(input);
    $input.parent().find('.password-visibility').click(function() {
        if($input.attr('type')=="password"){
          $input.attr('type', "text")
        } else {
          $input.attr('type', "password")
        }
    });
  });
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
            
            for(i=0; i<notes.length;i++){
              var title = escapeOutput(CryptoJS.AES.decrypt(notes[i].title, ik).toString(CryptoJS.enc.Utf8));
              var note = escapeOutput(CryptoJS.AES.decrypt(notes[i].note, ik).toString(CryptoJS.enc.Utf8));
              $("#notes-list").append(noteItemGive(title, note))
            }

            for(i=0; i<passes.length;i++){
              var website = escapeOutput(CryptoJS.AES.decrypt(passes[i].website, ik).toString(CryptoJS.enc.Utf8));
              var username = escapeOutput(CryptoJS.AES.decrypt(passes[i].username, ik).toString(CryptoJS.enc.Utf8));
              var password = escapeOutput(CryptoJS.AES.decrypt(passes[i].password, ik).toString(CryptoJS.enc.Utf8));
              $("#passes-list").append(passItemGive(website, username, password, i))
            }

            generateReadables()
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
        notesArray.unshift(encryptedPayload)
        chrome.storage.local.set({'secpassNotesData': notesArray}, function(){
          console.log("[DEBUG] Adding note to notes!")
          console.log(notesArray)
          $("#addSecNoteInputTitle").text("");
          $("#addSecNoteInputTextArea").text("")
          $("#addSecNoteDialog").css("display", "none")
          if($("#mainScreenNothingFound").is(":visible")){
            $("#mainScreenNothingFound").hide()
            $("#mainScreenSomethingFound").show()
          }
          $("#notes-list").prepend(noteItemGive(escapeOutput(title), escapeOutput(note)))
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
        passesArray.unshift(encryptedPayload)
        chrome.storage.local.set({'secpassPassesData': passesArray}, function(){
          console.log("[DEBUG] Adding password to passwords!")
          console.log(passesArray)
          $("#addSecPasswordInputWebsite").text("")
          $("#addSecPasswordInputUsername").text("")
          $("#addSecPasswordInputPassword").text("")
          $("#addSecPasswordDialog").css("display", "none")
          if($("#mainScreenNothingFound").is(":visible")){
            $("#mainScreenNothingFound").hide()
            $("#mainScreenSomethingFound").show()
          }
          $("#passes-list").prepend(passItemGive(website, username, password, passesArray.length-1))
          generateReadables()
        });
      });
    });
  } else {
    $("#addSecPasswordSubmitError").text("Empty fields!")
  }
}
