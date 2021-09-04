chrome.runtime.onInstalled.addListener(function(){
    var newURL = "https://batdaulaptrinh.com/welcome-to-udemy-extensions/";
    chrome.tabs.create({ url: newURL });
});

chrome.commands.onCommand.addListener((command) => {
    console.log(command);
    
})

chrome.tabs.onCreated.addListener(function(){
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) =>{
        chrome.tabs.sendMessage(tabs[0].id, {text: 'open a new tab'});
    })
})


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
        console.log(request);
    }
)