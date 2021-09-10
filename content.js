let KEY = 'STORAGE'


if (location.href.includes('success')) {
    setTimeout(function () {
        sendMessage('complete_a_course');
    }, 2000)
}
else if (isPurchased() || isExpired()) {
    setTimeout(function () {
        sendMessage('can_not_purchases');
    }, 2000)
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // alert('In content message is ' + request.message + ' and location.href ' + location.href) 
    if (request.message == 'enroll') {
        setTimeout(function() {
            enrollCourse();
        }, 3000)
    }
})


function sendMessage(msg) {
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

function isExpired() {
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
    if (referrer == '') {
        return false
    }
    return true
}
