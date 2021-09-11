let KEY_STORAGE = 'STORAGE'
let KEY_PAGES = 'KEY_PAGES'
let KEY_CURRENT_PAGE = 'KEY_CURRENT_PAGE'
let KEY_ON_OFF = 'KEY_ON_OFF'
chrome.runtime.onInstalled.addListener(function () {
    openWelcomePage()
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == 'auto_click') {
        let page = request.page
        fetchAPIAtPageNth(page)
        setTimeout(openNewTab, 1000);
        sendMessage('enroll')
        setTimeout(openEnrollCoursePage, 1500)
        setOnSwitch()

    } else if (request.message == 'complete_a_course' || request.message == 'can_not_purchases') {
        removeSuccesfullyEnrollCourse()
        setTimeout(openEnrollCoursePage, 500)
        sendMessage('enroll')
    }
})

function removeSuccesfullyEnrollCourse() {
    chrome.storage.sync.get(['KEY_STORAGE'], function (result) {
        courses = result['KEY_STORAGE']
        courses = courses.slice(1)
        chrome.storage.sync.set({ 'KEY_STORAGE': courses }, function () {
            console.log('update data after enroll suceessfully ' + courses.length);
        });
    })
}

function setOnSwitch(){
    chrome.storage.sync.set({ 'KEY_ON_OFF': true }, function () {});
}

async function openNewTab() {
    var newURL = "chrome://newtab";
    chrome.tabs.create({ url: newURL });
}


function openWelcomePage() {
    var newURL = "https://batdaulaptrinh.com/welcome-to-udemy-extensions/";
    chrome.tabs.create({ url: newURL });
}

function openEnrollCoursePage() {
    chrome.storage.sync.get(['KEY_STORAGE'], function (json) {
        let arrayCourses = json['KEY_STORAGE']
        // console.log('open course to enroll')
        if (arrayCourses.length > 0) {
            let urlEnroll = arrayCourses[0]
            chrome.tabs.update({
                url: urlEnroll
            });
        } 
    });
}

function sendMessage(msg) {
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

        chrome.tabs.query({ active: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { message: msg });
        });
    });
}

async function fetchAPIAtPageNth(page_nth) {

    let apiUrl = 'https://teachinguide.azure-api.net/course-coupon?sortCol=featured&sortDir=DESC&length=70&page=' + page_nth + '&inkw=&discount=100&language='

    fetch(apiUrl
    ).then((response) => {
        return response.json();
    })
        .then((json) => {
            let courses = getCourse(json)
            let arrayCourses = jsonToArrayCourses(courses)
            chrome.storage.sync.set({ KEY_STORAGE: arrayCourses }, function () { });
        }).catch(err => { console.log('encounter error ' + err) });
}

function jsonToArrayCourses(courses){
    let simpleJson = []
    for (const course of courses){
        simpleJson.push(getURLEnroll(course))
    }
    return simpleJson
}


function getCourse(json) {
    return json["results"]
}
function getPagesFrom(json) {
    return json['pages']
}

function getURLEnroll(course) {
    let idCourse = course['ImageUrl'].split('/')[5].split('_')[0]
    let codeCoupon = course['CouponCode']
    return "https://www.udemy.com/cart/checkout/express/course/" + idCourse + "/?discountCode=" + codeCoupon
}
