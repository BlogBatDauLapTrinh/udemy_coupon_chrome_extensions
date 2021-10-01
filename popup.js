
let switchOnOff = document.getElementById('switchOnOff')
let autoState = document.getElementById('auto_state')
let numberAvailable = document.getElementById('numberOfAvailableCoupons')
let currentEnrolled = document.getElementById('currentEnrolled')

chrome.storage.sync.get(['KEY_ON_OFF'], function (result) {
    let isOnSwitch = result['KEY_ON_OFF']
    if (isOnSwitch) {
        switchOnOff.src = '/images/green.png'
        autoState.innerText = 'AUTO IS ON'
    }else if(isOnSwitch == null){
        switchOnOff.src = '/images/red.png'
        autoState.innerText = 'AUTO IS STOP'
    }else if(isOnSwitch == false){
        switchOnOff.src = '/images/red.png'
        autoState.innerText = 'AUTO IS PAUSE'
    }
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if(request.message == 'update_ui'){
        updateUI()
        // alert('update_ui')
        let autoState = document.getElementById('auto_state')
        autoState.innerText = 'update_ui'
    }
    // alert('receive message ' + request.message)
})


showNumberOfAvailableCouponToday()
showStatusEnrollCourse()

switchOnOff.onclick = function (button) {
    updateUI()
    chrome.storage.sync.get(['KEY_ON_OFF'], function (result) {
        let isOnSwitch = result['KEY_ON_OFF']
        if (isOnSwitch) {


            setOffSwitch()
            autoState.innerText = 'AUTO IS PAUSED'
            switchOnOff.src = '/images/red.png'
        } else {
            autoHasBeenStoped(function (isStop) {
                if (isStop) {
                    alert('Auto has been stop')
                    return
                } else if(isStop == false) {
                    setOnSwitch()
                    autoState.innerText = 'AUTO IS ON'
                    switchOnOff.src = '/images/green.png'
                    chrome.runtime.sendMessage({ message: 'continue' });
                }
            })
        }
    })
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
            switchOnOff.src = '/images/green.png'
            autoState.innerText = 'AUTO IS ON'
        }else if(isOnSwitch == null){
            switchOnOff.src = '/images/red.png'
            autoState.innerText = 'AUTO IS STOP'
        }else if(isOnSwitch == false){
            switchOnOff.src = '/images/red.png'
            autoState.innerText = 'AUTO IS PAUSE'
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

let show_coupons = document.getElementById('show_coupons');
show_coupons.onclick = function (button) {
    console.log('navigate to show coupon page')
    var newURL = "https://batdaulaptrinh.com/udemy_coupons/";
    chrome.tabs.create({ url: newURL });
}

let auto_enroll1 = document.getElementById('auto_enroll1')
auto_enroll1.onclick = function (button) {
    chrome.runtime.sendMessage({ message: 'auto_click', numberOfCourse: 100 });
}

let auto_enroll2 = document.getElementById('auto_enroll2')
auto_enroll2.onclick = function (button) {
    chrome.runtime.sendMessage({ message: 'auto_click', numberOfCourse: 3 });
}

let options = document.getElementById('options')
options.onclick = function (button) {
    chrome.tabs.create({ url: "options.html" })
}



