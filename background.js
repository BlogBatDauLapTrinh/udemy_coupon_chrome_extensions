chrome.runtime.onInstalled.addListener(function () {
    openWelcomePage()
});



chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == 'auto_click') {
        console.log('button click')
        fetchAPI()
        openNewTab()
        sendMessage('open_new_tab')
    }else if (request.message == 'complete' || request.message == 'open_new_tab_successfully') {
        console.log('complete enroll')
        openEnrollCoursePage()
        sendMessage('continue_enrolling')
    }
})

function openNewTab(){
    var newURL = "chrome://newtab";
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
    chrome.storage.sync.get(['courses'], function (courses) {
        if (courses.length > 0) {
            let urlEnroll = getURLEnroll(course[0])

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
