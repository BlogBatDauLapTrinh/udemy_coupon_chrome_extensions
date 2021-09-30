
chrome.runtime.onInstalled.addListener(function () {
    openWelcomePage()
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == 'auto_click') {
        let page = request.page
        fetchAPIAtPageNth(page)
        sendMessage('enroll')
        setTimeout(openNewTab, 500);
        setIndexToZero()
        setTimeout(openEnrollCoursePage, 1500)
        setOnSwitch()

    } else if (request.message == 'complete_a_course' || request.message == 'can_not_purchases' || request.message == 'continue') {
        setIndexToNext()
        sendMessage('enroll')
        setTimeout(openEnrollCoursePage, 500)
    }
})

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

function getCurrentIndex(callback) {
    chrome.storage.sync.get(['KEY_INDEX'], function (json) {
        let currentIndex = json['KEY_INDEX']
        callback(currentIndex)
    })
}


function openWelcomePage() {
    var newURL = "https://batdaulaptrinh.com/welcome-to-udemy-extensions/";
    chrome.tabs.create({ url: newURL });
}

function openEnrollCoursePage() {
    chrome.storage.sync.get(['KEY_STORAGE'], function (json) {
        let arrayCourses = json['KEY_STORAGE']
        getCurrentIndex(function (index) {
            if (index < arrayCourses.length) {
                let urlEnroll = arrayCourses[index]
                chrome.tabs.update({
                    url: urlEnroll
                });
            }
            else{
                setOffSwitch()
            }

        })
    });
}

function sendMessage(msg) {
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

        chrome.tabs.query({ active: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { message: msg });
        });
    });
}
function fetchAPIAtPageNth(page_nth) {

    let apiUrl = 'https://teachinguide.azure-api.net/course-coupon?sortCol=featured&sortDir=DESC&length=5&page=' + page_nth + '&inkw=&discount=100&language='

    fetch(apiUrl
    ).then((response) => {
        return response.json();
    })
        .then((json) => {
            let courses = getCourse(json)
            let arrayCourses = jsonToArrayCourses(courses)
            chrome.storage.sync.set({ "KEY_STORAGE": arrayCourses }, function () {
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

function setOffSwitch(){
    chrome.storage.sync.set({ 'KEY_ON_OFF': false }, function () {});
}

function getCourse(json) {
    return json["results"]
}
function getPagesFrom(json) {
    return json['pages']
}
