let KEY = 'STORAGE'
let OPEN_KEY = "OPENKEY"
chrome.runtime.onInstalled.addListener(function () {
    openWelcomePage()
});

// chrome.storage.sync.set({ OPEN_KEY: false }, function () {
//     console.log('set flag successfully: false' )
// });

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == 'auto_click') {
        console.log('button click')
        fetchAPI()
        setTimeout(setFlagOpenNewTab,2000);
        setTimeout(openNewTab,400); 
    }else if (request.message == 'complete' || request.message == 'open_new_tab_successfully') {
        console.log('complete enroll')
        openEnrollCoursePage()
        sendMessage('continue_enrolling')
    }
})

async function setFlagOpenNewTab(){
    let flag = getFlagOpenNewTab()
    flag = !flag
    chrome.storage.sync.set({ OPEN_KEY: flag }, function () {
        console.log('set flag successfully: ' + flag )
    });
}

function getFlagOpenNewTab(){
    chrome.storage.sync.get(['OPEN_KEY'], function (flag) {
        return flag
    });
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

function sendMessage(msg){
    chrome.runtime.sendMessage({ message: msg }, function (response) {
        console.log(msg.message)
        console.log(response);
      });
}

function openEnrollCoursePage() {
    console.log('start nagigating new tab')
    chrome.storage.sync.get(['KEY'], function (courses) {
        console.log('get courses from database')
        console.log(courses)
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
