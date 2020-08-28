$(function(){
  
  $("#createAccountScreen").hide();
  $("#importAccountScreen").hide();
  $("#homeScreen").hide();
  $("#mainScreen").hide();
  $("#loginAccountScreen").hide();
  $("#mainScreenNothingFound").hide()
  $("#mainScreenSomethingFound").hide()
  $("#saveEditNoteBtn").hide()
  $("#saveEditPasswordBtn").hide()

  console.log("[DEBUG] Secpass started!");

  $("#searchBarNotePassword").on("input", function(){
    var search = $("#searchBarNotePassword").val().toLowerCase()
    chrome.storage.local.get(['secpassNotesData'], function(data){
      var notes = data.secpassNotesData
      chrome.storage.local.get(['secpassPassesData'], function(data){
        var passes = data.secpassPassesData
        chrome.storage.local.get(['secpassd'], function(data){
          var ik = data.secpassd.ik
          if(ik!=undefined){
              filteredNotes = notes.filter(function(value, i, arr){ 
                var title = escapeOutput(CryptoJS.AES.decrypt(arr[i].title, ik).toString(CryptoJS.enc.Utf8)).toLowerCase();
                var note = escapeOutput(CryptoJS.AES.decrypt(arr[i].note, ik).toString(CryptoJS.enc.Utf8)).toLowerCase();

                return title.includes(search) || note.includes(search)
              })
              generateNotesReadables(ik, filteredNotes)
              filteredPassword = passes.filter(function(value, i, arr){
                  var website = escapeOutput(CryptoJS.AES.decrypt(arr[i].website, ik).toString(CryptoJS.enc.Utf8)).toLowerCase();
                  var username = escapeOutput(CryptoJS.AES.decrypt(arr[i].username, ik).toString(CryptoJS.enc.Utf8)).toLowerCase();
                return website.includes(search) || username.includes(search)
              })
              generatePassesReadables(ik, filteredPassword)
            }
          })
        })
      })
    })
    //todo filter notes and passwords

  $("#mainScreen").ready(function(){

    chrome.storage.local.get(['secpassd'], function(data){
      console.log("[DEBUG] local.get() for userdata.")
      console.log(data);
      var info = data.secpassd;
      if(info!=undefined){
        login = info.loggedIn;
        console.log("[DEBUG] Status: "+login);
        if(login){
          loadUserData();
          $("#mainScreen").show();
        } else {
          $("#loginAccountScreen").show();
          $("#mainScreen").hide();
        }
      } else {
        console.log("[DEBUG] User data not found!");
        $("#homeScreen").show();
      }
    });

    $("#loginAccountScreen").ready(function(){
      $("#submitLoginInput").focus()
      $('#submitLoginInput').keydown(function(e) {
        if (e.keyCode == 13) {
            $('#submitLoginBtn').click();
        }
      });
      $("#submitLoginBtn").click(function(){
        var pass = $("#submitLoginInput").val()
        chrome.storage.local.get(['secpassverify'], function(data){
          var hashed = data.secpassverify.sample;
          console.log(hashed);
          if(data.secpassverify!=undefined){

            var hash = byteArrayToString(CryptoJS.PBKDF2(pass, "").words)
            console.log(hash)
            if(hash == hashed){
              //TODO loadUserData 
              loadUserData();
              userData = {
                "ik": pass,
                "loggedIn": true
              }

              chrome.storage.local.set({'secpassd': userData}, function(){
                console.log("[DEBUG] User reloaded!");
                $("#loginAccountSubmitError").text("");
                $("#loginAccountScreen").hide();
                $("#mainScreen").show();
              });

            } else {
              $("#loginAccountSubmitError").text("Incorrect password!");
            }
          } else {
            $('#form input').keydown(function(e) {
              if (e.keyCode == 13) {
                  $('#form').submit();
              }
          });console.log("[DEBUG] submitLoginBtn shouldn't reach here!");
          }
        });
      });
    });

    $("#addSecNoteSaveBtn").click(function(){
      var title = $("#addSecNoteInputTitle").val();
      var note = $("#addSecNoteInputTextArea").val();
      saveSecNote(title, note)
    });
    
    $("#addSecNoteDialogClose").click(function(){
      $("#addSecNoteDialog").css("display", "none")
    });
    
    $("#addSecPasswordDialogClose").click(function(){
      $("#addSecPasswordDialog").css("display", "none")  
    });
    $("#addSecPasswordSaveBtn").click(function(){
      var website = $("#addSecPasswordInputWebsite").val();
      var username = $("#addSecPasswordInputUsername").val();
      var password = $("#addSecPasswordInputPassword").val();
      saveSecPassword(website, username, password)
    });

  });

  $("#homeScreen").ready(function() {
    $("#createAccountBtn").click(function(){
      $("#homeScreen").hide();
      $("#createAccountScreen").show();
    });
    $("#importAccountBtn").click(function(){
      $("#homeScreen").hide();
      $("#importAccountScreen").show();
    });
  });

  $("#createAccountScreen").ready(function(){

    $('#createAccountPassword1').keydown(function(e) {
      if (e.keyCode == 13) {
          $('#createAccountPassword2').focus();
      }
    });
    $('#createAccountPassword2').keydown(function(e) {
      if (e.keyCode == 13) {
          $('#submitAccountPassowrdsBtn').click();
      }
    });
    $("#submitAccountPassowrdsBtn").click(function(){
      var pass1 = $("#createAccountPassword1").val();
      var pass2 = $("#createAccountPassword2").val();

      if(pass1!=pass2){
        $("#createAccountSubmitError").text("Passwords are different!");
      } else {
        if(pass1.length < 8){
          $("#createAccountSubmitError").text("Passwords should have more than 8 characters!");
        } else {
          
          $("#createAccountSubmitError").text("");
          
          userData = {
            "ik": pass1,
            "loggedIn": true
          }          

          var hash = CryptoJS.PBKDF2(pass1, "");
          
          userVerifyData = {
            "sample": byteArrayToString(hash.words)
          }

          chrome.storage.local.set({'secpassverify': userVerifyData}, function(){
            console.log("[DEBUG] User verification data saved!");
          });

          chrome.storage.local.set({'secpassd': userData}, function(){
            console.log("[DEBUG] User Saved set!");
            $("#createAccountScreen").hide();
            $("#mainScreen").show();
          });

          userPassesData = [];
          chrome.storage.local.set({'secpassPassesData': userPassesData}, function(){
            console.log("[DEBUG] Passes Data initialised!")
            console.log(userPassesData)
          })

          userNotesData = [];
          chrome.storage.local.set({'secpassNotesData': userNotesData}, function(){
            console.log("[DEBUG] Notes Data initialised!")
            console.log(userNotesData)
          })
          loadUserData()
        }
      }

    });
  });
});

