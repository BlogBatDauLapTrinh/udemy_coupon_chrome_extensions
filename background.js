
chrome.runtime.onInstalled.addListener(function () {
    openWelcomePage()
});

chrome.commands.onCommand.addListener((command) => {
    console.log(command)
    if (command == 'auto_enroll_100coupons') {
        let numberOfCourse = 100
        setnumberOfEnrollCourse(numberOfCourse)
        fetchAPI(numberOfCourse)
        sendMessage('enroll')
        setTimeout(openNewTab, 500);
        setIndexToZero()
        setTimeout(openEnrollCoursePage, 1500)
        setOnSwitch()
        update_badge(true)
    }if (command == 'show_all_coupons') {
        var newURL = "https://batdaulaptrinh.com/udemy_coupons/";
        chrome.tabs.create({ url: newURL });
    }if (command == 'pause'){
        setOffSwitch()
        update_badge(false)
    }
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('message is ' + request.message)
    if (request.message == 'auto_click') {
        let numberOfCourse = request.numberOfCourse
        setnumberOfEnrollCourse(numberOfCourse)
        fetchAPI(numberOfCourse)
        sendMessage('enroll')
        setTimeout(openNewTab, 500);
        setIndexToZero()
        setTimeout(openEnrollCoursePage, 1500)
        setOnSwitch()

    } else if (request.message == 'complete_a_course' || request.message == 'can_not_purchases' || request.message == 'continue') {
        setIndexToNext()
        sendMessage('enroll')
        sendMessageToPopup('update_ui')
        setTimeout(openEnrollCoursePage, 500)
    }
})

function update_badge(isOn){
    if(isOn){
        chrome.browserAction.setBadgeText({text: "ON"})
        chrome.browserAction.setBadgeBackgroundColor({ color: "#00FF00" })
    }else if(isOn == null){
        chrome.browserAction.setBadgeText({text: "STOP"})
        chrome.browserAction.setBadgeBackgroundColor({ color: "#FF0000" })
    }else{
        chrome.browserAction.setBadgeText({text: "PAUSE"})
        chrome.browserAction.setBadgeBackgroundColor({ color: "#CCCC00" })
    }
}

function createWindow(){
    chrome.windows.create({
        focused: true,
        width: 400,
        height: 600,
        type: 'popup',
        url: 'popup.html',
        top: 0,
        left: 0
      },
      () => {})
}


function setOnSwitch() {
    chrome.storage.sync.set({ 'KEY_ON_OFF': true }, function () { });
}

function openNewTab() {
    var newURL = "chrome://newtab";
    chrome.tabs.create({ url: newURL });
}

function setIndexToZero() {
    chrome.storage.sync.set({ 'KEY_INDEX': 0 }, function () {
        console.log('set index to zero')
    });
}

function setIndexToNext() {
    getCurrentIndex(function (index) {
        var nextIndex = Number(index) + 1
        chrome.storage.sync.set({ 'KEY_INDEX': nextIndex }, function () {
            console.log('set index to ' + nextIndex)
        });
    })
}

function getNumberOfAvailableCoupon(callback) {
    chrome.storage.sync.get(['KEY_AVAILABLE_COUPON'], function (json) {
        let numberOfAvailableCoupons = json['KEY_AVAILABLE_COUPON']
        callback(numberOfAvailableCoupons)
    })
}


function getCurrentIndex(callback) {
    chrome.storage.sync.get(['KEY_INDEX'], function (json) {
        let currentIndex = json['KEY_INDEX']
        callback(currentIndex)
    })
}

function setnumberOfEnrollCourse(numberOfEnrollCourse) {
    chrome.storage.sync.set({ 'KEY_NUMBER_ENROLL': numberOfEnrollCourse }, function () { });
}

function getNumberOfEnroll(callback) {
    chrome.storage.sync.get(['KEY_NUMBER_ENROLL'], function (json) {
        let numberOfEnroll = json['KEY_NUMBER_ENROLL']
        callback(numberOfEnroll)
    })
}


function openWelcomePage() {
    var newURL = "https://batdaulaptrinh.com/welcome-to-udemy-extensions/";
    chrome.tabs.create({ url: newURL });
}

function openEnrollCoursePage() {
    getNumberOfEnroll(function (numberOfEnroll) {
        console.log('open enroll course page')

        getCurrentIndex(function (index) {
            var currentPage = Math.ceil((index + 1) / 6)
            var keyStrogae = 'KEY_STORAGE' + currentPage
            console.log('key storage is ' + keyStrogae + ' and number of enroll is ' + numberOfEnroll)
            chrome.storage.sync.get([keyStrogae], function (json) {
                let arrayCourses = json[keyStrogae]
                if (index < numberOfEnroll) {
                    let urlEnroll = arrayCourses[index % 6]
                    chrome.tabs.update({
                        url: urlEnroll
                    });
                }
                else {
                    console.log('set null switch')
                    setNullSwitch()
                    sendMessageToPopup('update_ui')
                    update_badge(null)
                }

            })

        })

    });
}

function setNullSwitch() {
    chrome.storage.sync.set({ 'KEY_ON_OFF': null }, function () { });
}

function sendMessageToPopup(msg) {
    chrome.runtime.sendMessage({
        message: msg
    })
}

function sendMessage(msg) {
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

        chrome.tabs.query({ active: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { message: msg });
        });
    });
}
function fetchAPI(numberOfCourse) {
    console.log('start fetch api')
    var numberOfSet = Math.ceil(numberOfCourse / 6)
    for (let i = 0; i < numberOfSet; i++) {
        storeAPIOfAllCourses(numberOfCourse, i)
    }
    chrome.storage.sync.get(null, function (items) {
        var allKeys = Object.keys(items);
        console.log(allKeys);
    });
}

function storeAPIOfAllCourses(numberOfCourse, page_nth) {
    page_nth += 1
    var length = (numberOfCourse > 6 * page_nth) ? 6 : numberOfCourse - 6 * (page_nth - 1)
    let apiUrl = 'https://teachinguide.azure-api.net/course-coupon?sortCol=featured&sortDir=DESC&length=' + length + '&page=' + page_nth + '&inkw=&discount=100&language='
    console.log('api is ' + apiUrl)
    fetch(apiUrl
    )
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            let courses = getCourse(json)
            let arrayCourses = jsonToArrayCourses(courses)
            let keyStore = "KEY_STORAGE" + page_nth
            chrome.storage.sync.set({ [keyStore]: arrayCourses }, function () {
                console.log('fetch API successfully')
            });
        }).catch(err => { console.log('encounter error ' + err) });
}

function jsonToArrayCourses(courses) {
    let simpleJson = []
    for (const course of courses) {
        simpleJson.push(getURLEnroll(course))
    }
    return simpleJson
}

function getURLEnroll(course) {
    let idCourse = course['ImageUrl'].split('/')[5].split('_')[0]
    let codeCoupon = course['CouponCode']
    return "https://www.udemy.com/cart/checkout/express/course/" + idCourse + "/?discountCode=" + codeCoupon
}

function setOffSwitch() {
    chrome.storage.sync.set({ 'KEY_ON_OFF': false }, function () { });
}

function getCourse(json) {
    return json["results"]
}
function getPagesFrom(json) {
    return json['pages']
}
