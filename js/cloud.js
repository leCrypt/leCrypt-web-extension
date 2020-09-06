$("#cloudGoogleBtn").click(function(){
    console.log("[DEBUG] Google Drive Service chosen!")
    chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
        // Use the token.
    });
})
$(function(){

})