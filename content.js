let KEY = 'STORAGE'
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // alert('In content message is ' + request.message + ' and location.href ' + location.href) 
    if(request.message == 'enroll'){
        setTimeout(function() {
            // alert('log thu phat')
            // if ()
            enrollCourse();
        }, 5000)
        if(location.href.includes('success') ){
            chrome.runtime.sendMessage({ message: 'complete' });
        }
    }
})

function sendMessage(msg){
    chrome.runtime.sendMessage({ message: msg }, function (response) {
        // alert('send message from content (message : ' + msg + ') + ( respone : ' + response +' )')
    });
}

function enrollCourse() {
    var inputs = document.getElementsByTagName('button');

    for (var i = 0; i < inputs.length; i++) {
        // alert(inputs[i].textContent)
        if (inputs[i]["type"] == 'submit' && inputs[i].textContent == 'Enroll now') {
            inputs[i].click()
        }
    }

}

function isPurchased() {
    var allB = document.getElementsByTagName('b');
    for (var i = 0; i < allB.length; i++) {
        if (allB[i].textContent == 'You purchased this course') {
            return true
        }
    }
    return false

}