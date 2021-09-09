let KEY = 'STORAGE'
chrome.runtime.onInstalled.addListener(function () {
    openWelcomePage()
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    
    setTimeout(function(){
        handleRequest(request)
    },0)
})

function handleRequest(request){
    if (request.message == 'auto_click') {
        let START_INDEX = 0
        fetchAPI()
        setTimeout(openNewTab, 0);
        setTimeout(function () {
            sendMessage('enroll', START_INDEX)
        }, 0)
        setTimeout(function () {
            openEnrollCoursePage(START_INDEX)
        }, 0)
    }
    
    else if (request.message['command'] == 'clicked_enroll_button') {
        let index = request.message['index']
        sendMessage('check_successes', index)
    }
    
    else if (request.message['command'] == 'complete') {
        let nextIndex = request.message['index'] + 1
        setTimeout(function () {
            openEnrollCoursePage(nextIndex)
        }, 0)
    } 
}


function openNewTab() {
    var newURL = "chrome://newtab";
    chrome.tabs.create({ url: newURL });
}

function openWelcomePage() {
    var newURL = "https://batdaulaptrinh.com/welcome-to-udemy-extensions/";
    chrome.tabs.create({ url: newURL });
}

function openEnrollCoursePage(index) {

    chrome.storage.sync.get(['KEY'], function (json) {
        courses = json['KEY']['courses']
        console.log(index + '/' + courses.length)
        // index = json['KEY']['index']
        if (index < courses.length) {
            sendMessage('enroll', index)
            let urlEnroll = getURLEnroll(courses[index])
            chrome.tabs.update({
                url: urlEnroll
            });
        }
    });
}

function sendMessage(command, index) {
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

        chrome.tabs.query({ active: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { message: { 'command': command, 'index': index } });
        });
    });
}

async function fetchAPI() {

    let apiUrl = 'https://teachinguide.azure-api.net/course-coupon?sortCol=featured&sortDir=DESC&length=8&page=6&inkw=&discount=100&language='

    fetch(apiUrl
    ).then((response) => {
        return response.json();
    })
        .then((json) => {
            let courses = getCourse(json)
            chrome.storage.sync.set({ KEY: { 'courses': courses, 'index': 0 } }, function () {
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
