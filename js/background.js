$(function(){
    chrome.idle.setDetectionInterval(15);
    console.log("[Background] Start on: "+ new Date());
    chrome.idle.onStateChanged.addListener(function(val){
        if(val == "idle"){
            console.log("[Background] Idle on: "+ new Date());
            userData = {
                "ik": "",
                "loggedIn": false
            }
            chrome.storage.local.set({'secpassd': userData}, function(){
                console.log("[Background] Idle Timed Out! User Logged out!");
            });
        } else if (val == "active"){
            console.log("[Background] Went Active on: "+ new Date());
        }
    });
});
