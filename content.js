
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // alert('In content message is ' + request.message['command'] +request.message['index']+ ' and location.href ' + location.href) 
   setTimeout(function(){
    handleRequest(request)
   },1500)
})


function handleRequest(request){
    if (request.message['command'] == 'enroll') {
        // alert('message is enroll')   
        let index = request.message['index']
        if (isPurchased()) {
            setTimeout(function () {
                sendMessage('complete', index);
            }, 0)
        }else{
            setTimeout(function(){
            sendMessage('clicked_enroll_button', index)
            },0)

            setTimeout(function () {
                enrollCourse();
            }, 0)
        }
        // alert(index + ' click enroll')
    }
    if (request.message['command'] == 'check_successes') {
        // alert('message is check success')
        let index = request.message['index']
        if (location.href.includes('success')) {
            setTimeout(function () {
                sendMessage('complete', index);
            }, 0)
        }else if (isExpired()) {
            setTimeout(function () {
                sendMessage('complete', index);
            }, 0)
        }
    }
}


function sendMessage(command, index) {
    chrome.runtime.sendMessage({ message: { 'command': command, 'index': index } }, function (response) { });
}

function enrollCourse() {
    var inputs = document.getElementsByTagName('button');

    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i]["type"] == 'submit' && inputs[i].textContent == 'Enroll now') {
            // alert(inputs[i].textContent)
            inputs[i].click()
            return
        }
    }

}

function isExpired() {
    var inputs = document.getElementsByTagName('button');
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i]["type"] == 'submit' && inputs[i].textContent == 'Complete Payment') {
            return true
        }
    }
}

function isPurchased() {
    var referrer = document.referrer;
    if (referrer == '') {
        return false
    }
    return true
}
