
let switchOnOff = document.getElementById('switchOnOff')
let autoState = document.getElementById('auto_state')
let numberAvailable = document.getElementById('numberOfAvailableCoupons')
let currentEnrolled = document.getElementById('currentEnrolled')


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if(request.message == 'update_ui'){
        updateUI()
        autoState.innerText = 'update_ui'
    }else if(request.message == 'update_badge'){
        initialize_auto_state()
    }
})

let auto_enroll1 = document.getElementById('auto_enroll1')
auto_enroll1.onclick = function (button) {
    chrome.runtime.sendMessage({ message: 'auto_click', numberOfCourse: 100 });
}


let show_coupons = document.getElementById('show_coupons');
show_coupons.onclick = function (button) {
console.log('navigate to show coupon page')
var newURL = "https://batdaulaptrinh.com/udemy_coupons/";
chrome.tabs.create({ url: newURL });
}


initialize_auto_state()
hanle_onclick_switch()
handle_onclick_bottom_item()
showNumberOfAvailableCouponToday()
showStatusEnrollCourse()

function initialize_auto_state(){
    chrome.storage.sync.get(['KEY_ON_OFF'], function (result) {
        let isOnSwitch = result['KEY_ON_OFF']
        if (isOnSwitch) {
            updateOnSwitchUI()
        }else if(isOnSwitch == null){
            updateStopSwitchUI()
        }else if(isOnSwitch == false){
            updatePauseSwitchUI()
        }
    })
    
}

function hanle_onclick_switch(){
    switchOnOff.onclick = function (button) {
        updateUI()
        chrome.storage.sync.get(['KEY_ON_OFF'], function (result) {
            let isOnSwitch = result['KEY_ON_OFF']
            if (isOnSwitch) {
                setOffSwitch()
                updatePauseSwitchUI()
            } else {
                autoHasBeenStoped(function (isStop) {
                    if (isStop) {
                        alert('Auto has been stop')
                        return
                    } else if(isStop == false) {
                        setOnSwitch()
                        updateOnSwitchUI()
                        chrome.runtime.sendMessage({ message: 'continue' });
                    }
                })
            }
        })
    }    
}

function handle_onclick_bottom_item(){

    let questions = document.getElementById('questions')
    questions.onclick = function (button) {
        chrome.tabs.create({ url: "questions.html" })
    }

    let facebook = document.getElementById('facebook')
    facebook.onclick = function (button) {
        chrome.tabs.create({ url: "https://www.facebook.com/huythanh.cs/" })
    }

    let github = document.getElementById('github')
    github.onclick = function (button) {
        chrome.tabs.create({ url: "https://github.com/Huythanh0x/udemy_coupon_chrome_extensions" })
    }

    let bug = document.getElementById('bug')
    bug.onclick = function (button) {
        chrome.tabs.create({ url: "https://mail.google.com/mail/?view=cm&fs=1&to=batdaulaptrinh@gmail.com&su=Phản ánh về bug tại extensions Auto udemy coupons&body=Tôi có dùng extension và phát hiện các lỗi sau" })
    }

}

function updateOnSwitchUI(){
    switchOnOff.src = '/images/green.png'
    autoState.innerText = 'AUTO IS ON'
    chrome.browserAction.setBadgeText({text: "ON"})
    chrome.browserAction.setBadgeBackgroundColor({ color: '#00FF00' })
}

function updatePauseSwitchUI(){
    switchOnOff.src = '/images/yellow.png'
    autoState.innerText = 'AUTO IS PAUSE'
    chrome.browserAction.setBadgeText({text: "PAUSE"})
    chrome.browserAction.setBadgeBackgroundColor({ color: '#CCCC00' }) 
}

function updateStopSwitchUI(){
    switchOnOff.src = '/images/red.png'
    autoState.innerText = 'AUTO IS STOP'
    chrome.browserAction.setBadgeText({text: "STOP"})
    chrome.browserAction.setBadgeBackgroundColor({ color: '#FF0000' })
}


function setIndexToPrevious() {
    getCurrentIndex(function (index) {
        var nextIndex = Number(index) - 1
        chrome.storage.sync.set({ 'KEY_INDEX': nextIndex }, function () {
            console.log('set index to ' + nextIndex)
        });
    })
}

function updateUI(){

    chrome.storage.sync.get(['KEY_ON_OFF'], function (result) {
        let isOnSwitch = result['KEY_ON_OFF']
        if (isOnSwitch) {
            updateOnSwitchUI()
        }else if(isOnSwitch == null){
            updateStopSwitchUI()
        }else if(isOnSwitch == false){
            updatePauseSwitchUI()
        }
    })
    
    chrome.storage.sync.get(['KEY_NUMBER_ENROLL'], function (result) {
        let numberOfEnroll = result['KEY_NUMBER_ENROLL']
        getCurrentIndex(function (index) {
            if (index != undefined){
                currentEnrolled.innerText = "Has enrolled " + index + "/" + numberOfEnroll
            }
            else{
                currentEnrolled.innerText = "Choose an opntion to start"
            }
        })

    })
}

function showStatusEnrollCourse(){
    chrome.storage.sync.get(['KEY_NUMBER_ENROLL'], function (result) {
        let numberOfEnroll = result['KEY_NUMBER_ENROLL']
        getCurrentIndex(function (index) {
            if (index != undefined){
                currentEnrolled.innerText = "Has enrolled " + index + "/" + numberOfEnroll
            }
            else{
                currentEnrolled.innerText = "Choose an opntion to start"
            }
        })

    })
    
}

function autoHasBeenStoped(callback) {
    chrome.storage.sync.get(['KEY_NUMBER_ENROLL'], function (json) {
        let numberOfEnrollCourse = json['KEY_NUMBER_ENROLL']
        if(numberOfEnrollCourse==undefined){
            alert('Choose an option to start')
        }
        getCurrentIndex(function (index) {
            if (index >= Number(numberOfEnrollCourse)) {
                callback(true)
            } else {
                callback(false)
            }
        })
    });
}

function showNumberOfAvailableCouponToday() {
    chrome.storage.sync.get(['KEY_AVAILABLE_COUPON'], function (result) {
        let numberOfAvailableCoupons = result['KEY_AVAILABLE_COUPON']
        fetchNumberOfAvailableCouponToday()
        numberAvailable.innerText = 'THERE ARE ' + numberOfAvailableCoupons + ' TODAY '
        

    })
}

function fetchNumberOfAvailableCouponToday() {

    let apiUrl = 'https://teachinguide.azure-api.net/course-coupon?sortCol=featured&sortDir=DESC&length=1&page=1&inkw=&discount=100&language='

    fetch(apiUrl
    ).then((response) => {
        return response.json();
    })
        .then((json) => {
            let numberOfAvailableCourse = json['recordsFiltered']
            chrome.storage.sync.set({ 'KEY_AVAILABLE_COUPON': numberOfAvailableCourse }, function () {
            });
        }).catch(err => { console.log('encounter error ' + err) });
}

function setOffSwitch() {
    chrome.storage.sync.set({ 'KEY_ON_OFF': false }, function () { });
}

function setOnSwitch() {
    chrome.storage.sync.set({ 'KEY_ON_OFF': true }, function () { });
}

function getCurrentIndex(callback) {
    chrome.storage.sync.get(['KEY_INDEX'], function (json) {
        let currentIndex = json['KEY_INDEX']
        callback(currentIndex)
    })
}
