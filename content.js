let KEY = 'STORAGE'

// message: {'command':command,'index':index}
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // alert('In content message is ' + request.message['command'] +request.message['index']+ ' and location.href ' + location.href) 
    if(request.message['command'] == 'enroll'){
        setTimeout(function() {
            enrollCourse();
        }, 3000)
        let index = request.message['index']
        // alert(index)
        if(location.href.includes('success')){
            // alert('send back message complete')
            setTimeout(function() {
                sendMessage('complete',index);
            }, 2000) 
        }

        if(isPurchased() || isExpired()){
            // alert('send back message expired or purchased')
            setTimeout(function() {
                sendMessage('complete',index);
            }, 2000)
        }
    }
})


function sendMessage(command,index){
    chrome.runtime.sendMessage({ message: {'command':command,'index':index} }, function (response) {
        // alert('send message from content (message : ' + msg + ') + ( respone : ' + response +' )')
    });
}

function enrollCourse() {
    var inputs = document.getElementsByTagName('button');

    for (var i = 0; i < inputs.length; i++) {
        // alert(inputs[i].textContent)
        if (inputs[i]["type"] == 'submit' && inputs[i].textContent == 'Enroll now') {
            inputs[i].click()
            return
        }
    }

}

function isExpired(){
    var inputs = document.getElementsByTagName('button');
    for (var i = 0; i < inputs.length; i++) {
        // alert(inputs[i].textContent)
        if (inputs[i]["type"] == 'submit' && inputs[i].textContent == 'Complete Payment') {
            return true
        }
    }
}

function isPurchased() {
    var referrer = document.referrer;
    if (referrer == ''){
        return false
    }
    return true
}
