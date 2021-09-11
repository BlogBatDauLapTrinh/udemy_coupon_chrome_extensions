
let switchOnOff = document.getElementById('switchOnOff')
let autoState = document.getElementById('auto_state')

chrome.storage.sync.get(['KEY_ON_OFF'], function (result) {
    let isOnSwitch = result['KEY_ON_OFF']
    if(isOnSwitch){
        switchOnOff.src = 'https://t4.rbxcdn.com/e3dbb8df601fa72eb4107858afb2af35'
        autoState.innerText = 'AUTO IS ON'
    }else{
        switchOnOff.src = 'https://static.wikia.nocookie.net/speed-city/images/0/0a/RedCircleIMG.png/revision/latest?cb=20190304214532'
        autoState.innerText = 'AUTO IS OFF'
    }  
})

switchOnOff.onclick = function (button) {
    chrome.storage.sync.get(['KEY_ON_OFF'], function (result) {
        let isOnSwitch = result['KEY_ON_OFF']
        if(isOnSwitch){
            setOffSwitch()
            autoState.innerText = 'AUTO IS OFF'
            switchOnOff.src = 'https://static.wikia.nocookie.net/speed-city/images/0/0a/RedCircleIMG.png/revision/latest?cb=20190304214532'
        }else{
            alert('ERROR CHOOSE AUTO OPTIONS TO START')
        }  
    })
}

function setOffSwitch(){
    chrome.storage.sync.set({ 'KEY_ON_OFF': false }, function () {});
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



