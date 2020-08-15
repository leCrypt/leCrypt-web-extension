$(function(){

  $("#createAccountScreen").hide();
  $("#importAccountScreen").hide();
  console.log("[DEBUG] Secpass started!");

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
          
          //TODO create account
        }
      }

    });
  });
});

