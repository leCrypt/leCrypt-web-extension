var fr = new FileReader();
var passesArray = []

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
    var lines = fr.result.split('\n')
    if(lines[0].includes("name,url,username,password")){
        $("#loginImportSpan").text("[+] Loading logins...")
        count = 0;
        loadedFields = []

        chrome.storage.local.get(['secpassd'], function(data){
            var key = data.secpassd.ik;
        for(i=1;i<=lines.length;i++){
            if(i<lines.length){
                fields = lines[i].split(",")
                loadedFields.push(fields)
                count+=1
            } else {
                $("#loginImportSpan").append("</br> [+] Loading Done! </br>")
                $("#loginImportSpan").append("[+] Found "+count+" logins! </br>")
                    for(j=0;j<=loadedFields.length;j++){
                        if(j<loadedFields.length){
                            var website = base_url(loadedFields[j][1], "/")
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

function base_url(loc, segment){
    // get the segments
    pathArray = loc.split( '/' );
    // find where the segment is located
    indexOfSegment = pathArray.indexOf(segment);
    // make base_url be the origin plus the path to the segment
    res = pathArray.slice(0,indexOfSegment)
    return res[0]+"//"+res[2]+ '/';
 }