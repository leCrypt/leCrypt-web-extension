var fr = new FileReader();
var passesArray = []
$("#loginImportFormScreen").hide()
var service = ""

$(function(){
    console.log("[DEBUG] File Import Started!")
    chrome.storage.local.get(['secpassd'], function(data){
        console.log("[DEBUG] local.get() for userdata.")
        console.log(data);

    });
    $("#loginFileImport").change(function(e){
        var file = e.target.files[0]; 
        console.log(file)
        fr.onload = receivedText;
        fr.readAsText(file);
    })
    chrome.storage.local.get(['secpassPassesData'], function(data){
        if(data.secpassPassesData!=undefined)
            passesArray = data.secpassPassesData
    })
})

function receivedText() {
    if(service == "google"){
        googleImports()
    } else if(service == "firefox"){
        firefoxImports()
    } else if(service == "bitwarden"){
        bitwardenImports()
    }
}

$("#serviceGoogleBtn").click(function(){
    service = "google"
    $("#chooseServiceScreen").hide()
    $("#loginImportFormScreen").show()
})

$("#serviceFirefoxBtn").click(function(){
    service = "firefox"
    $("#chooseServiceScreen").hide()
    $("#loginImportFormScreen").show()
})

$("#serviceBitwardenBtn").click(function(){
    service = "bitwarden"
    $("#chooseServiceScreen").hide()
    $("#loginImportFormScreen").show()
})

function base_url(loc){
    // get the segments
    pathArray = loc.split( '/' );
    return pathArray[0]+"//"+pathArray[2]+ '/';
}

function googleImports(){
    var lines = fr.result.split('\n')
    if(lines[0].includes("name,url,username,password")){
        $("#loginImportSpan").text("[+] Loading logins...")
        count = 0;
        loadedFields = []

        chrome.storage.local.get(['secpassd'], function(data){
            var key = data.secpassd.ik;
        for(i=1;i<=lines.length;i++){
            if(i<lines.length && lines[i].includes(",")){
                fields = lines[i].split(",")
                loadedFields.push(fields)
                count+=1
            } else {
                $("#loginImportSpan").append("</br> [+] Loading Done! </br>")
                $("#loginImportSpan").append("[+] Found "+count+" logins! </br>")
                    for(j=0;j<=loadedFields.length;j++){
                        if(j<loadedFields.length){
                            var website = base_url(loadedFields[j][1])
                            var username = loadedFields[j][2]
                            var password = loadedFields[j][3]
                                var encryptedWebsite = CryptoJS.AES.encrypt(website, key).toString();
                                var encryptedUsername = CryptoJS.AES.encrypt(username, key).toString();
                                var encryptedPassword = CryptoJS.AES.encrypt(password, key).toString();
                                encryptedPayload = {
                                    "website": encryptedWebsite,
                                    "username": encryptedUsername,
                                    "password": encryptedPassword
                                }
                                passesArray.push(encryptedPayload)

                        } else {
                            chrome.storage.local.set({'secpassPassesData': passesArray}, function(){
                                console.log("[DEBUG] Imported passwords to passwords!")
                                chrome.storage.local.get(['secpassPassesData'], function(data){
                                    console.log(data.secpassPassesData)
                                })
                            });
                            $("#loginImportSpan").text("[+] Done Importing logins!")
                        }
                    }
                
            }
        }
        })
        
    } else {
        alert("Invalid File Selected!")
        $("#loginImportSpan").text("Please select a google passwords exported file (csv)")
    }
}

function firefoxImports(){
    var lines = fr.result.split('\n')

    if(lines[0].includes("\"url\",\"username\",\"password\"")){
        $("#loginImportSpan").text("[+] Loading logins...")
        count = 0;
        loadedFields = []

        chrome.storage.local.get(['secpassd'], function(data){
            var key = data.secpassd.ik;
        for(i=1;i<=lines.length;i++){
            if(i<lines.length && lines[i].includes("\",\"")){
                fields = lines[i].split(",")
                loadedFields.push(fields)
                count+=1
            } else {
                console.log(loadedFields)
                $("#loginImportSpan").append("</br> [+] Loading Done! </br>")
                $("#loginImportSpan").append("[+] Found "+count+" logins! </br>")
                    for(j=0;j<=loadedFields.length;j++){
                        if(j<loadedFields.length){
                            console.log(loadedFields[j])
                            var website = base_url(loadedFields[j][0].split("\"").join(""))
                            console.log(loadedFields[j][0].split("\"").join(""))
                            var username = loadedFields[j][1].split("\"").join("")
                            var password = loadedFields[j][2].split("\"").join("")
                                var encryptedWebsite = CryptoJS.AES.encrypt(website, key).toString();
                                var encryptedUsername = CryptoJS.AES.encrypt(username, key).toString();
                                var encryptedPassword = CryptoJS.AES.encrypt(password, key).toString();
                                encryptedPayload = {
                                    "website": encryptedWebsite,
                                    "username": encryptedUsername,
                                    "password": encryptedPassword
                                }
                                passesArray.push(encryptedPayload)
                        } else {
                            chrome.storage.local.set({'secpassPassesData': passesArray}, function(){
                                console.log("[DEBUG] Imported passwords to passwords!")
                                chrome.storage.local.get(['secpassPassesData'], function(data){
                                    console.log(data.secpassPassesData)
                                })
                            });
                            $("#loginImportSpan").text("[+] Done Importing logins!")
                        }
                    }
                
            }
        }
        })
    } else {
        alert("Invalid File Selected!")
        $("#loginImportSpan").text("Please select a firefox passwords exported file (csv)")
    }
}

function bitwardenImports(){
    var lines = fr.result.split('\n')

    if(lines[0].includes("type,name,notes,fields,login_uri,login_username,login_password")){
        $("#loginImportSpan").text("[+] Loading logins...")
        count = 0;
        loadedFields = []

        chrome.storage.local.get(['secpassd'], function(data){
            var key = data.secpassd.ik;
        for(i=1;i<=lines.length;i++){
            if(i<lines.length && lines[i].includes("login,")){
                fields = lines[i].split(",")
                loadedFields.push(fields)
                count+=1
            } else {
                console.log(loadedFields)
                $("#loginImportSpan").append("</br> [+] Loading Done! </br>")
                $("#loginImportSpan").append("[+] Found "+count+" logins! </br>")
                    for(j=0;j<=loadedFields.length;j++){
                        if(j<loadedFields.length){
                            console.log(loadedFields[j])
                            var website = base_url(loadedFields[j][6])
                            console.log(loadedFields[j][6])
                            var username = loadedFields[j][7]
                            var password = loadedFields[j][8]
                                var encryptedWebsite = CryptoJS.AES.encrypt(website, key).toString();
                                var encryptedUsername = CryptoJS.AES.encrypt(username, key).toString();
                                var encryptedPassword = CryptoJS.AES.encrypt(password, key).toString();
                                encryptedPayload = {
                                    "website": encryptedWebsite,
                                    "username": encryptedUsername,
                                    "password": encryptedPassword
                                }
                                passesArray.push(encryptedPayload)
                        } else {
                            chrome.storage.local.set({'secpassPassesData': passesArray}, function(){
                                console.log("[DEBUG] Imported passwords to passwords!")
                                chrome.storage.local.get(['secpassPassesData'], function(data){
                                    console.log(data.secpassPassesData)
                                })
                            });
                            $("#loginImportSpan").text("[+] Done Importing logins!")
                        }
                    }
                
            }
        }
        })
    } else {
        alert("Invalid File Selected!")
        $("#loginImportSpan").text("Please select a bitwarden passwords exported file (csv)")
    }
}
