$(function () {
  $("#createAccountScreen").hide();
  $("#importAccountScreen").hide();
  $("#homeScreen").hide();
  $("#mainScreen").hide();
  $("#loginAccountScreen").hide();
  $("#mainScreenNothingFound").hide();
  $("#mainScreenSomethingFound").hide();
  $("#saveEditNoteBtn").hide();
  $("#saveEditPasswordBtn").hide();

  console.log("[DEBUG] Secpass started!");

  $("#mainScreen").ready(function () {
    chrome.storage.local.get(["secpassd"], function (data) {
      console.log("[DEBUG] local.get() for userdata.");
      console.log(data);
      var info = data.secpassd;
      if (info != undefined) {
        login = info.loggedIn;
        console.log("[DEBUG] Status: " + login);
        if (login) {
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

    $("#loginAccountScreen").ready(function () {
      $("#submitLoginInput").focus();
      $("#submitLoginInput").keydown(function (e) {
        if (e.keyCode == 13) {
          $("#submitLoginBtn").click();
        }
      });
      $("#submitLoginBtn").click(function () {
        var pass = $("#submitLoginInput").val();
        chrome.storage.local.get(["secpassverify"], function (data) {
          var hashed = data.secpassverify.sample;
          console.log(hashed);
          if (data.secpassverify != undefined) {
            var hash = CryptoJS.SHA256(pass);
            console.log(hash.toString(CryptoJS.enc.Hex));
            if (hash == hashed) {
              loadUserData();
              userData = {
                ik: pass,
                loggedIn: true,
              };

              chrome.storage.local.set(
                {
                  secpassd: userData,
                },
                function () {
                  console.log("[DEBUG] User reloaded!");
                  $("#loginAccountSubmitError").text("");
                  $("#loginAccountScreen").hide();
                  $("#mainScreen").show();
                }
              );
            } else {
              $("#loginAccountSubmitError").text("Incorrect password!");
            }
          } else {
            $("#form input").keydown(function (e) {
              if (e.keyCode == 13) {
                $("#form").submit();
              }
            });
            console.log("[DEBUG] submitLoginBtn shouldn't reach here!");
          }
        });
      });
    });

    $("#addSecNoteSaveBtn").click(function () {
      var title = $("#addSecNoteInputTitle").val();
      var note = $("#addSecNoteInputTextArea").val();
      saveSecNote(title, note);
    });

    $("#addSecNoteDialogClose").click(function () {
      $("#addSecNoteDialog").css("display", "none");
    });

    $("#addSecPasswordDialogClose").click(function () {
      $("#addSecPasswordDialog").css("display", "none");
    });

    $("#import").click(function () {
      chrome.tabs.create({
        url: "fileimport.html",
      });
    });

    $("#refresh").click(function () {
      console.log("[DEBUG] Refresh started...");
      $("#refreshDialog").css("display", "block");
      $("#refreshDialogDialogClose").click(function () {
        $("#refreshDialog").css("display", "none");
        $("#refreshDialogInputIPAddr").val("");
        $("#refreshDialogInputToken").val("");
        $("#refreshDialogSubmitError").text("");
      });

      $("#refreshDialogSaveBtn").click(function () {
        progressOn();
        var ip = $("#refreshDialogInputIPAddr").val();
        $.get("http://" + ip + ":8692/api/getToken", function (data) {
          var qrData = JSON.parse(data);
          var tk = $("#refreshDialogInputToken").val();
          if (qrData.token == tk) {
            getLoginsFromDataPoint(ip);
            getNotesFromDataPoint(ip);
            $("#refreshDialogSubmitError").text("Done Refreshing ✔️");
          } else {
            $("#refreshDialogSubmitError").text("Token Expired/Incorrect!");
            console.log("[DEBUG] Token Expired/Incorrect");
          }
        })
          .fail(function () {
            $("#refreshDialogSubmitError").text(
              "Incorrect IP Address/Unreachable!"
            );
          })
          .always(function () {
            progressOff();
          });
      });
    });

    $("#settings").click(function () {
      console.log("[DEBUG] Settings yet to be implemented!");
      //settings page
    });

    $("#info").click(async function () {
      $("#selfInfoDialog").css("display", "block");
      $.get("http://127.0.0.1:8692/api/qr_output", function (data) {
        var qrData = JSON.parse(data);
        $("#selfInfoDialogIPAdd").text(qrData.ip);
        $("#selfInfoDialogToken").text(qrData.token);
        var image = new Image();
        image.src = "data:image/png;base64," + qrData.base64qr;
        image.style.width = "200px";
        $("#selfInfoQRCode").append(image);
      });
      $("#selfInfoDialogClose").click(function () {
        $("#selfInfoDialog").css("display", "none");
        $("#selfInfoQRCode").empty();
        $("#selfInfoDialogIPAdd").text("");
        $("#selfInfoDialogToken").text("");
      });
    });

    $("#addSecPasswordSaveBtn").click(function () {
      var website = $("#addSecPasswordInputWebsite").val();
      var username = $("#addSecPasswordInputUsername").val();
      var password = $("#addSecPasswordInputPassword").val();
      saveSecPassword(website, username, password);
    });
  });

  $("#homeScreen").ready(function () {
    $("#createAccountBtn").click(function () {
      $("#homeScreen").hide();
      $("#createAccountScreen").show();
    });
    $("#importAccountBtn").click(function () {
      $("#homeScreen").hide();
      $("#importAccountScreen").show();
    });
  });

  $("#importAccountScreen").ready(function () {
    $("#loginScreenSubmitLoginBtn").click(function () {
      progressOn();
      var ip = $("#loginScreenInputIPAddr").val();
      $.get("http://" + ip + ":8692/api/getToken", function (data) {
        var qrData = JSON.parse(data);
        var tk = $("#loginScreenInputToken").val();
        if (qrData.token == tk) {
          getHashFromNative($("#loginScreenInputPassword").val(), ip);
        } else {
          $("#loginScreenSubmitError").text("Token Expired/Incorrect!");
          console.log("[DEBUG] Token Expired/Incorrect");
        }
      })
        .fail(function () {
          $("#loginScreenSubmitError").text(
            "Incorrect IP Address/Unreachable!"
          );
        })
        .always(function () {
          progressOff();
        });
    });
  });

  $("#createAccountScreen").ready(function () {
    $("#createAccountPassword1").keydown(function (e) {
      if (e.keyCode == 13) {
        $("#createAccountPassword2").focus();
      }
    });
    $("#createAccountPassword2").keydown(function (e) {
      if (e.keyCode == 13) {
        $("#submitAccountPassowrdsBtn").click();
      }
    });
    $("#submitAccountPassowrdsBtn").click(function () {
      var pass1 = $("#createAccountPassword1").val();
      var pass2 = $("#createAccountPassword2").val();

      if (pass1 != pass2) {
        $("#createAccountSubmitError").text("Passwords are different!");
      } else {
        if (pass1.length < 8) {
          $("#createAccountSubmitError").text(
            "Passwords should have more than 8 characters!"
          );
        } else {
          $("#createAccountSubmitError").text("");

          userData = {
            ik: pass1,
            loggedIn: true,
          };

          var hash = CryptoJS.SHA256(pass1)

          userVerifyData = {
            sample: hash.toString(CryptoJS.enc.Hex),
          };

          chrome.storage.local.set(
            {
              secpassverify: userVerifyData,
            },
            function () {
              console.log("[DEBUG] User verification data saved!");
            }
          );

          chrome.storage.local.set(
            {
              secpassd: userData,
            },
            function () {
              console.log("[DEBUG] User Saved set!");
              $("#createAccountScreen").hide();
              $("#mainScreen").show();
            }
          );

          userPassesData = [];
          chrome.storage.local.set(
            {
              secpassPassesData: userPassesData,
            },
            function () {
              console.log("[DEBUG] Passes Data initialised!");
              console.log(userPassesData);
            }
          );

          userNotesData = [];
          chrome.storage.local.set(
            {
              secpassNotesData: userNotesData,
            },
            function () {
              console.log("[DEBUG] Notes Data initialised!");
              console.log(userNotesData);
            }
          );
          loadUserData();
        }
      }
    });
  });
});
