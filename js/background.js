$(function () {
  chrome.idle.setDetectionInterval(timeOutPeriod);
  console.log("[Background] Start on: " + new Date());
  chrome.idle.onStateChanged.addListener(function (val) {
    if (val == "idle") {
      console.log("[Background] Idle on: " + new Date());

      userData = {
        ik: "",
        loggedIn: false,
      };

      chrome.storage.local.get(["secpassd"], function (data) {
        if (data.secpassd != undefined) {
          chrome.storage.local.set({ secpassd: userData }, function () {
            console.log("[Background] Idle Timed Out! User Logged out!");
          });
        }
      });
    } else if (val == "active") {
      console.log("[Background] Went Active on: " + new Date());
    }
  });
});

chrome.runtime.onMessage.addListener(function (message, sender, respond) {
  if (message.from == "secpass_content_script") {
    if ((message.action = "secpass_fill_available")) {
      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var url = tabs[0].url;
        console.log(url);
        chrome.storage.local.get(["secpassd"], function (data) {
          var userData = data.secpassd;
          if (data.secpassd.ik != "") {
            console.log("[DEBUG] User is logged out!");
            chrome.storage.local.get(["secpassPassesData"], function (data) {
              var passes = data.secpassPassesData;
              for (i = 0; i < passes.length; i++) {
                var website = decrypt(
                  passes[i].website,
                  userData.ik
                )
                var username = decrypt(
                  passes[i].username,
                  userData.ik
                )
                var password = decrypt(
                  passes[i].password,
                  userData.ik
                )
                if (url.includes(website)) {
                  console.log("[DEBUG] User Data Found for the website!");
                  chrome.tabs.sendMessage(tabs[0].id, {
                    from: "secpass_background",
                    action: "secpass_do_fill",
                    user: username,
                    pass: password,
                  });
                }
              }
            });
          }
        });
      });
    }
  } else if(message.from == "secpass_popup_script" && message.action == "secpass_change_timeout") {
    console.log("[DEBUG] User changed timeout period")
    console.log(message.period/60)
    chrome.idle.setDetectionInterval(message.period);
  }

  return true;
});
