$(function(){

  $("#createAccountScreen").hide();
  $("#importAccountScreen").hide();
  $("#homeScreen").hide();
  $("#mainScreen").hide();
  
  console.log("[DEBUG] Secpass started!");

  $("#mainScreen").ready(function(){

    chrome.storage.local.get(['secpassd'], function(data){
      console.log("[DEBUG] local.get() for userdata.")
      console.log(data);
      var info = data.secpassd;
      if(info!=undefined){
        login = info.loggedIn;
        console.log("[DEBUG] Status: "+login);
        if(login){
          
        } else {
          
        }
        $("#mainScreen").show();
      } else {
        console.log("[DEBUG] User data not found!");
        $("#homeScreen").show();
      }
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

          chrome.storage.local.set({'secpassd': userData}, function(){
            console.log("[DEBUG] User Saved set!");
            $("#createAccountScreen").hide();
            $("#mainScreen").show();
          });

          //TODO create account
        }
      }

    });
  });
});

