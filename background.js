let KEY = 'STORAGE'
let NEW_COURSE_KEY = "NEW_COURSE"
chrome.runtime.onInstalled.addListener(function () {
    openWelcomePage()
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == 'auto_click') {
        fetchAPI()
        setTimeout(openNewTab, 1000);
        setTimeout(openEnrollCoursePage, 1000)
        sendMessage('enroll')

    } else if (request.message == 'complete') {
        removeSuccesfullyEnrollCourse()
        console.log('complete enroll')
        setTimeout(openEnrollCoursePage, 1000)
        sendMessage('enroll')
    }
})

function removeSuccesfullyEnrollCourse() {
    chrome.storage.sync.get(['KEY'], function (result) {
        courses = result['KEY']
        courses = courses.slice(1)
        chrome.storage.sync.set({'KEY': courses }, function () {
            console.log('update data after enroll suceessfully' + courses.length);
        });
    })
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
    
    chrome.storage.sync.get(['KEY'], function (json) {
        courses = json['KEY']
        if (courses.length > 0) {
            let urlEnroll = getURLEnroll(courses[0])
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

async function fetchAPI() {

    // let apiUrl = 'https://teachinguide.azure-api.net/course-coupon?sortCol=featured&sortDir=DESC&length=5&page=0&inkw=&discount=100&language=&'
    let apiUrl = 'https://teachinguide.azure-api.net/course-coupon?sortCol=featured&sortDir=DESC&length=5&page=1&inkw=&discount=100&language='

    fetch(apiUrl
    ).then((response) => {
        return response.json();
    })
        .then((json) => {
            let courses = getCourse(json)
            chrome.storage.sync.set({ KEY: courses }, function () {
                // console.log('set new course key = true ');
            });
        }).catch(err => { console.log('encounter error ' + err) });
}

function getCourse(json) {
    return json["results"]
}
function getPages(json) {
    return json['pages']
}

function getURLEnroll(course) {
    let idCourse = course['ImageUrl'].split('/')[5].split('_')[0]
    let codeCoupon = course['CouponCode']
    return "https://www.udemy.com/cart/checkout/express/course/" + idCourse + "/?discountCode=" + codeCoupon
}
