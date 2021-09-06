chrome.runtime.onInstalled.addListener(function () {
    openWelcomePage()
});

//background.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // console.log('listening in background' + request)
    if (request.message == 'enroll_successfully') {
        enrollACourse()
        console.log('continue enrolling course')
    }

    else if (request.message == 'auto_click') {
        fetchAPI()
        openNewTab()
        enrollACourse()
        console.log('open newtab -> enroll first course')
    }
})

function openWelcomePage() {
    var newURL = "https://batdaulaptrinh.com/welcome-to-udemy-extensions/";
    chrome.tabs.create({ url: newURL });
}

function openNewTab() {
    var newURL = "https://batdaulaptrinh.com/welcome-to-udemy-extensions/";
    chrome.tabs.create({ url: newURL });
}

function enrollACourse() {
    chrome.storage.sync.get(['courses'], function (courses) {
        if (courses.openEnrollCourselength > 0) {
            (courses[0])
            // chrome.runtime.sendMessage({ message: courses[0] });
            sendMessage(courses[0])
        }
    });
}

function sendMessage(message) {
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

        chrome.tabs.query({ active: true }, function (tabs) {
            const msg = 'Hello from background ?';
            chrome.tabs.sendMessage(tabs[0].id, { message: message });
        });
    }
    );
}

function fetchAPI() {

    let apiUrl = 'https://teachinguide.azure-api.net/course-coupon?sortCol=featured&sortDir=DESC&length=2&page=2&inkw=&discount=100&language=&'

    fetch(apiUrl
    ).then((response) => {
        return response.json();
    })
        .then((json) => {
            let courses = getCourse(json)
            chrome.storage.sync.set({ "courses": courses }, function () {
                console.log('in background Value is set to ' + courses);
            });

        }).catch(err => { console.log(err) });
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


function openEnrollCourse(course) {
    console.log("open enroll course")
    let urlEnroll = getURLEnroll(course)

    chrome.tabs.update({
        url: urlEnroll
    });
}