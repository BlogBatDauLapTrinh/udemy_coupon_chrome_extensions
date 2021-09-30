
let switchOnOff = document.getElementById('switchOnOff')
let autoState = document.getElementById('auto_state')

chrome.storage.sync.get(['KEY_ON_OFF'], function (result) {
    let isOnSwitch = result['KEY_ON_OFF']
    if(isOnSwitch){
        switchOnOff.src = '/images/green.png'
        autoState.innerText = 'AUTO IS ON'
    }else{
        switchOnOff.src = '/images/red.png'
        autoState.innerText = 'AUTO IS OFF'
    }  
})

switchOnOff.onclick = function (button) {
    chrome.storage.sync.get(['KEY_ON_OFF'], function (result) {
        let isOnSwitch = result['KEY_ON_OFF']
        if(isOnSwitch){
            setOffSwitch()
            autoState.innerText = 'AUTO IS PAUSED'
            switchOnOff.src = '/images/red.png'
        }else{
            setOnSwitch()
            autoState.innerText = 'AUTO IS ON'
            switchOnOff.src = '/images/green.png'
            chrome.runtime.sendMessage({message:'continue', page:2});
        }  
    })
}

function setOffSwitch(){
    chrome.storage.sync.set({ 'KEY_ON_OFF': false }, function () {});
}

function setOnSwitch(){
    chrome.storage.sync.set({ 'KEY_ON_OFF': true }, function () {});
}


let show_coupons = document.getElementById('show_coupons');
show_coupons.onclick = function (button) {
    console.log('navigate to show coupon page')
    var newURL = "https://batdaulaptrinh.com/udemy_coupons/";
    chrome.tabs.create({ url: newURL });
}

let auto_enroll1 = document.getElementById('auto_enroll1')
auto_enroll1.onclick = function (button) {
    chrome.runtime.sendMessage({message:'auto_click', page:1});
}

let auto_enroll2 = document.getElementById('auto_enroll2')
auto_enroll2.onclick = function (button) {
    chrome.runtime.sendMessage({message:'auto_click', page:2});
}

let options = document.getElementById('options')
options.onclick = function (button) {
    chrome.tabs.create({ url: "options.html" })
}



