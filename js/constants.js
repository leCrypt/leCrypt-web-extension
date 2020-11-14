var timeOutPeriod = 5*60
chrome.storage.local.get(['secpassTimeOutPeriod'], function(data){
    if(data.secpassTimeOutPeriod === undefined){
        chrome.storage.local.set({secpassTimeOutPeriod: timeOutPeriod}, function() {
            console.log("[DBEUG] Setting timeout period for the first time")
        })   
    } else {
        timeOutPeriod = data.secpassTimeOutPeriod
        $("#settingsTimeOutRangeSlider").val(data.secpassTimeOutPeriod/60)
    }
})