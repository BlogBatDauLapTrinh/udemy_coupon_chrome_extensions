let KEY = 'STORAGE'
let NEW_COURSE_KEY = "NEW_COURSE_KEY"
chrome.runtime.onInstalled.addListener(function () {
    openWelcomePage()
});

console.log(getNewCourseKey())

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == 'auto_click') {
        console.log('button click')
        fetchAPI()
        setTimeout(function() {
            setNewCourseKey(true);
        }, 1000)
        setTimeout(openNewTab,1000); 
    }else if (request.message == 'complete'){
        console.log('complete enroll')
        openEnrollCoursePage()
        setTimeout(function() {
            setNewCourseKey(true);
        }, 1000)
        setTimeout(openEnrollCoursePage,500)
    }
})

function setNewCourseKey(flag){
    chrome.storage.sync.set({ NEW_COURSE_KEY: flag }, function () {
        console.log('set new course key = true ');
    });
}

function getNewCourseKey(){
    chrome.storage.sync.get(['KEY'], function (result) {
        return result
    })
}

async function openNewTab(){
    console.log('opened new tab')
    var newURL = "chrome://newtab";
    // newURL = "https://batdaulaptrinh.com/welcome-to-udemy-extensions/";
    chrome.tabs.create({ url: newURL });
}

function openWelcomePage() {
    var newURL = "https://batdaulaptrinh.com/welcome-to-udemy-extensions/";
    chrome.tabs.create({ url: newURL });
}

function openEnrollCoursePage() {
    console.log('start nagigating new course')
    chrome.storage.sync.get(['KEY'], function (json) {
        console.log('get courses from database')
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

    let apiUrl = 'https://teachinguide.azure-api.net/course-coupon?sortCol=featured&sortDir=DESC&length=5&page=2&inkw=&discount=100&language=&'

    fetch(apiUrl
    ).then((response) => {
        return response.json();
    })
        .then((json) => {
            let courses = getCourse(json)
            chrome.storage.sync.set({ KEY: courses }, function () {
                console.log('fetch API successfully KEY ' + courses.length + ' courses');
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
