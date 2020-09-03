var fileReader = new FileReader();
var loginsArray = []
var service = ""

$(function(){
    $("#loginImportFormScreen").hide()
    console.log("[DEBUG] Login Import Started!")
    $("#loginFileImport").change(function(e){
        var file = e.target.files[0];
        fileReader.onload = receivedText;
        fileReader.readAsText(file);
    })
    chrome.storage.local.get(['secpassPassesData'], function(data){
        if(data.secpassPassesData!=undefined)
            loginsArray = data.secpassPassesData
    })
})

$("#serviceGoogleBtn").click(function(){
    service = "google"
    importScreenShow()
    console.log("[DEBUG] Google selected as service!")
})

$("#serviceFirefoxBtn").click(function(){
    service = "firefox"
    importScreenShow()
    console.log("[DEBUG] Firefox selected as service!")
})

$("#serviceBitwardenBtn").click(function(){
    service = "bitwarden"
    importScreenShow()
    console.log("[DEBUG] Bitwarden selected as service!")
})

function base_url(loc){
    pathArray = loc.split( '/' );
    return pathArray[0]+"//"+pathArray[2]+ '/';
}

function receivedText() {
    if(service == "google"){
        importLogins("name,url,username,password", ",", 1, 2, 3)
    } else if(service == "firefox"){
        importLogins("\"url\",\"username\",\"password\"", ",", 0, 1, 2)
    } else if(service == "bitwarden"){
        importLogins("type,name,notes,fields,login_uri,login_username,login_password", ",", 6, 7, 8)
    }
}

function importScreenShow(){
    $("#chooseServiceScreen").hide()
    $("#loginImportFormScreen").show()
}

function importLogins(verifier, delimiter, urlIndex, usernameIndex, passwordIndex){
    var lines = fileReader.result.split('\n')
    if(lines[0].includes(verifier)){
        console.log("[DEBUG] Import started, with service of choice: "+service)
        $("#loginImportSpan").text("[+] Loading logins...")
        chrome.storage.local.get(['secpassd'], function(data){
            var key = data.secpassd.ik;
            for(i=1;i<=lines.length;i++){
                if(i<lines.length && lines[i].includes(delimiter)){
                    fields = lines[i].split(delimiter)
                    flag = (service == "google" || service == "bitwarden")
                    var encryptedWebsite = CryptoJS.AES.encrypt(base_url(flag ? fields[urlIndex] : fields[urlIndex].slice(1, fields[urlIndex].length-1)), key).toString();
                    var encryptedUsername = CryptoJS.AES.encrypt(flag ? fields[usernameIndex] : fields[usernameIndex].slice(1, fields[usernameIndex].length-1), key).toString();
                    var encryptedPassword = CryptoJS.AES.encrypt(flag ? fields[passwordIndex] : fields[passwordIndex].slice(1, fields[passwordIndex].length-1), key).toString();
                    encryptedPayload = {
                        "website": encryptedWebsite,
                        "username": encryptedUsername,
                        "password": encryptedPassword
                    }
                    loginsArray.push(encryptedPayload)  
                } else if(i==lines.length) {
                    $("#loginImportSpan").text("[+] Done loading logins!")
                    chrome.storage.local.set({'secpassPassesData': loginsArray}, function(){
                        console.log("[DEBUG] Import of logins successfully finished!")
                        chrome.storage.local.get(['secpassPassesData'], function(data){
                            console.log(data.secpassPassesData)
                        })
                    });
                }
            }
        })
    } else {
        alert("Invalid File Selected!")
        $("#loginImportSpan").text("Please select a "+service+" passwords exported file (csv)!")
    }
}
