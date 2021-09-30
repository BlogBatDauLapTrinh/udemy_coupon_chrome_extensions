
chrome.storage.sync.get(['KEY_ON_OFF'], function (result) {
    let isOnSwitch = result['KEY_ON_OFF']
    if (isOnSwitch) {
        if (location.href.includes('success')) {
            setTimeout(function () {
                sendMessage('complete_a_course');
            }, 2000)
        }
        else if (isPurchased() || isExpired() || isFailed()) {
            setTimeout(function () {
                sendMessage('can_not_purchases');
            }, 2000)
        }

    }
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == 'enroll') {
        setTimeout(function () {
            clickEnrollButton();
        }, 3000)
    }
})

function sendMessage(msg) {
    chrome.runtime.sendMessage({ message: msg }, function (response) {});
}

    function clickEnrollButton() {
        var inputs = document.getElementsByTagName('button');
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i]["type"] == 'submit' && inputs[i].textContent == 'Enroll now') {
                inputs[i].click()
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

function isFailed(){
    var inputs = document.getElementsByTagName('div')
    for (var i=0;i < inputs.length;i++){
        if (inputs[i]['class'] == 'checkout--right-col--1y9nm'){
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
