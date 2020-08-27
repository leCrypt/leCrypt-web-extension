var addSecNoteButton = document.getElementById('addSecNote');
var addSecNoteDialog = document.getElementById('addSecNoteDialog');

var addSecPasswordButton = document.getElementById('addSecPassword');
var addSecPasswordDialog = document.getElementById('addSecPasswordDialog');

$("#addSecNote").click(function(){
  $("#addSecNoteDialog").css("display", "block")
  $("#addSecNoteDialogTitle").text("Add Note")
  $("#addSecNoteInputTitle").val("")
  $("#addSecNoteInputTextArea").val("")
  $("#addSecNoteSubmitError").val("")
  $("#addSecNoteSaveBtn").show()
  $("#saveEditNoteBtn").hide()
  $("#deleteEditNoteBtn").hide()
});

$("#addSecPassword").click(function(){
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
      .replace(/\'/g, '&#x27');
}

function noteItemGive(title, note){
  var noteItem= '<div style="border-style: solid; border-color: black; border-width: 4px; border-radius: 5px; font-size: medium; margin: 0.5em; padding-left: 2%; padding-bottom: 2%; background-color: white; color: black;">'
              + ' <li>'
              + ' <div class="notes-header" style="display: flex; justify-content: space-between;">'
              + '   <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: bold; font-size: 24px; margin-right: 2%; display: inline-block; word-break: break-word;" class="notetitle">'+title+'</span>'
              + '   <div class="smallboxes edit-note"><i class="fas fa-pen"></i></div>'
              + ' </div>' 
              + '   <div style="width:80%; border: 2px solid #6c63ff; border-radius: 50px;"></div>'
              + '   <p class="note" style="padding: 0px; margin: 0px; margin-right: 2%; display: inline-block; word-break: break-word;">'+note+'</p>'
              + ' </li>'
              + '</div>'
  return noteItem
}

function passItemGive(website, username, password, id){
  var passItem= '<div style="border-style: solid; border-color: black; border-width: 4px; border-radius: 5px; font-size: medium; margin: 0.5em; padding-left: 2%; padding-bottom: 2%; background-color: white; color: black;">'
              + ' <li>'
              + '   <div class="password-header" style="display: flex; justify-content: space-between;">'
              + '     <span class="website" style="margin-top: 2%; margin-bottom: 2%; margin-left: 1%; width: 85%; font-weight: bold; font-size: 16px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">'+website+'</span>'
              + '     <div class="smallboxes edit-password"><i class="fas fa-pen"></i></div>'
              + '   </div>'
              + '   <div style="width:80%; border: 2px solid #6c63ff; border-radius: 50px;"></div>'
              + '   <p class="username" style="font-size: large; margin: 1%; display: inline-block; word-break: break-word;">'+username+'</p>'
              + '   <div class="password-group" style="margin:1%;">'
              + '   <div>'
              + '     <input readonly id="passInput'+id+'" class="form-control password-box" aria-label="password" type="password" style="vertical-align: middle; width:73%; margin: 0px; margin-right: 2%; border-style: solid; border-radius: 4px; border-color: black; border-width: 2px; font-size: large; box-shadow: 0px 0px;" value="'+password+'">'
              + '     <span style="font-size: x-large; vertical-align: middle; margin-bottom: 3px;" class="clipper tooltip"><i class="far fa-clipboard"></i><span class="tooltiptext">copy</span></span>'
              + '     <input type="checkbox" id="passCheck'+id+'" class="password-visibility" style="width: 28px; height: 28px; margin-left: 2%; vertical-align: middle; box-shadow: 0px 0px;">'              
              + '   </div>'
              + '   </div>'
              + ' </li>'
              + '</div>'
  return passItem;
}

function generatePassesReadables(ik, passes){
  $("#passes-list").empty()
  
  for(i=0; i<passes.length;i++){
    var website = escapeOutput(CryptoJS.AES.decrypt(passes[i].website, ik).toString(CryptoJS.enc.Utf8));
    var username = escapeOutput(CryptoJS.AES.decrypt(passes[i].username, ik).toString(CryptoJS.enc.Utf8));
    var password = escapeOutput(CryptoJS.AES.decrypt(passes[i].password, ik).toString(CryptoJS.enc.Utf8));
    $("#passes-list").append(passItemGive(website, username, password, i))
  }

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
  $('.password-group').find('.clipper').each(function(index, clipper){
    $(clipper).click(function(){
      $(clipper).parent().find('.password-box').attr('type', "text")
      $(clipper).parent().find('.password-box').select()
      document.execCommand("copy")
      $(clipper).parent().find('.password-box').attr('type', "password")
      $(clipper).find('.tooltiptext').text("copied!")
      setTimeout(function(){
        $(clipper).find('.tooltiptext').text("copy")
      }, 600)

    })
  })
  $(".password-header").find(".edit-password").each(function(index, div){

    var $div = $(div)
    $div.click(function(){
      $("#addSecPasswordDialog").css("display", "block")
      $("#addSecPasswordDialogTitle").text("Edit Password")
      var website = escapeOutput(CryptoJS.AES.decrypt(passes[index].website, ik).toString(CryptoJS.enc.Utf8));
      var username = escapeOutput(CryptoJS.AES.decrypt(passes[index].username, ik).toString(CryptoJS.enc.Utf8));
      var password = escapeOutput(CryptoJS.AES.decrypt(passes[index].password, ik).toString(CryptoJS.enc.Utf8));
      $("#addSecPasswordInputWebsite").val(website)
      $("#addSecPasswordInputUsername").val(username)
      $("#addSecPasswordInputPassword").val(password)
      $("#addSecPasswordSubmitError").val("")
      $("#addSecPasswordSaveBtn").hide()
      $("#saveEditPasswordBtn").show()
      $("#deleteEditPasswordBtn").show()
      
      $("#saveEditPasswordBtn").click(function(){
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
        passes[index] = encryptedPayload
        chrome.storage.local.set({'secpassPassesData': passes}, function(){
          console.log("[DEBUG] Editing password in passwords!")
          console.log(passes)
          $("#addSecPasswordInputWebsite").val("")
          $("#addSecPasswordInputUsername").val("")
          $("#addSecPasswordInputPassword").val("")
          $("#addSecPasswordDialog").css("display", "none")
          generatePassesReadables(key, passes)
        })
      })

      $("#deleteEditPasswordBtn").click(function(){
        arr = passes.filter(function(value, i, arr){ return i != index;});
        chrome.storage.local.set({'secpassPassesData': arr}, function(){
          console.log("[DEBUG] Deleting password from passwords!: "+new Date())
          console.log(arr)
          $("#addSecPasswordInputWebsite").val("")
          $("#addSecPasswordInputUsername").val("")
          $("#addSecPasswordInputPassword").val("")
          $("#addSecPasswordDialog").css("display", "none")
          generatePassesReadables(ik, arr)
        });
      })

    })
  })
}

function generateNotesReadables(ik, notes){
  $("#notes-list").empty()
  
  for(i=0; i<notes.length;i++){
    var title = escapeOutput(CryptoJS.AES.decrypt(notes[i].title, ik).toString(CryptoJS.enc.Utf8));
    var note = escapeOutput(CryptoJS.AES.decrypt(notes[i].note, ik).toString(CryptoJS.enc.Utf8));
    $("#notes-list").append(noteItemGive(title, note))
  }

  $(".notes-header").find(".edit-note").each(function(index, div){
    var $div = $(div)
    $div.click(function(){
      $("#addSecNoteDialog").css("display", "block")
      $("#addSecNoteDialogTitle").text("Edit Note")
      var title = escapeOutput(CryptoJS.AES.decrypt(notes[index].title, ik).toString(CryptoJS.enc.Utf8));
      var note = escapeOutput(CryptoJS.AES.decrypt(notes[index].note, ik).toString(CryptoJS.enc.Utf8));
      $("#addSecNoteInputTitle").val(title)
      $("#addSecNoteInputTextArea").val(note)
      $("#addSecNoteSubmitError").val("")
      $("#addSecNoteSaveBtn").hide()
      $("#saveEditNoteBtn").show()
      $("#deleteEditNoteBtn").show()
      
      $("#saveEditNoteBtn").click(function(){
        var key = ik;
        var title = $("#addSecNoteInputTitle").val();
        var note = $("#addSecNoteInputTextArea").val();
        var encryptedTitle = CryptoJS.AES.encrypt(title, key).toString();
        var encryptedNote = CryptoJS.AES.encrypt(note, key).toString();
        encryptedPayload = {
          "title": encryptedTitle,
          "note": encryptedNote
        }
        notes[index] = encryptedPayload
        chrome.storage.local.set({'secpassNotesData': notes}, function(){
          console.log("[DEBUG] Editing note in notes!: "+new Date())
          console.log(notes)
          $("#addSecNoteInputTitle").val("")
          $("#addSecNoteInputTextArea").val("")
          $("#addSecNoteDialog").css("display", "none")

          generateNotesReadables(key, notes)
        });
      })

      $("#deleteEditNoteBtn").click(function(){
        arr = notes.filter(function(value, i, arr){ return i != index;});
        chrome.storage.local.set({'secpassNotesData': arr}, function(){
          console.log("[DEBUG] Deleting note in notes!: "+new Date())
          console.log(arr)
          $("#addSecNoteInputTitle").val("")
          $("#addSecNoteInputTextArea").val("")
          $("#addSecNoteDialog").css("display", "none")
    
          generateNotesReadables(ik, arr)
        });
      })
      console.log(index)
    })
    
  })

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
            $("#searchBarNotePassword").hide()
          } else {
            generateNotesReadables(ik, notes)
            generatePassesReadables(ik, passes)
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
          $("#addSecNoteInputTitle").val("")
          $("#addSecNoteInputTextArea").val("")
          $("#addSecNoteDialog").css("display", "none")
          
          if($("#mainScreenNothingFound").is(":visible")){
            $("#mainScreenNothingFound").hide()
            $("#mainScreenSomethingFound").show()
          }
          generateNotesReadables(key, notesArray)
        });
      });
    });
  } else {
    $("#addSecNoteSubmitError").text("Empty fields!")
  }
}

function saveSecPassword(website, username, password){
  if(!regexUsername(website)){
    $("#addSecPasswordSubmitError").text("Invalid Website URL!")
  } else if(website!=""&&username!=""&&password!="") {
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
          $("#addSecPasswordInputWebsite").val("")
          $("#addSecPasswordInputUsername").val("")
          $("#addSecPasswordInputPassword").val("")
          $("#addSecPasswordDialog").css("display", "none")
          if($("#mainScreenNothingFound").is(":visible")){
            $("#mainScreenNothingFound").hide()
            $("#mainScreenSomethingFound").show()
          }
          generatePassesReadables(key, passesArray)
        });
      });
    });
  } else {
    $("#addSecPasswordSubmitError").text("Empty fields!")
  }
}

function regexUsername(inp){
  return /^(https?):\/\/[^\s$.?#].[^\s]*$/i.test(inp);
}
