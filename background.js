let KEY_STORAGE = 'STORAGE'
let KEY_PAGES = 'KEY_PAGES'
let KEY_CURRENT_PAGE = 'KEY_CURRENT_PAGE'
chrome.runtime.onInstalled.addListener(function () {
    openWelcomePage()
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == 'auto_click') {
        setCurrentPage(1)
        updateNumberOfPage()
        fetchAPIAtPageNth(1)
        setTimeout(openNewTab, 1000);
        setTimeout(openEnrollCoursePage, 1500)
        sendMessage('enroll')

    } else if (request.message == 'complete_a_course' || request.message == 'can_not_purchases') {
        removeSuccesfullyEnrollCourse()
        setTimeout(openEnrollCoursePage, 1500)
        sendMessage('enroll')
    }
})

function removeSuccesfullyEnrollCourse() {
    chrome.storage.sync.get(['KEY_STORAGE'], function (result) {
        courses = result['KEY_STORAGE']
        courses = courses.slice(1)
        chrome.storage.sync.set({ 'KEY_STORAGE': courses }, function () {
            console.log('update data after enroll suceessfully' + courses.length);
        });
    })
}

async function openNewTab() {
    var newURL = "chrome://newtab";
    chrome.tabs.create({ url: newURL });
}

function getPages() {
    let pages = 1;
    chrome.storage.sync.get(['KEY_PAGES'], function (result) {
        pages = result['KEY_PAGES']
    })
    return pages
}

function getCurrentPage() {
    let current_page = 1;
    chrome.storage.sync.get(['KEY_CURRENT_PAGE'], function (result) {
        current_page = result['KEY_CURRENT_PAGE']
    })
    return current_page
}

function setCurrentPage(page_nth) {
    chrome.storage.sync.set({ KEY_CURRENT_PAGE: page_nth }, function () {
    });
}

function setPages(pages) {
    chrome.storage.sync.set({ KEY_PAGES: pages }, function () {
    });
}

function openWelcomePage() {
    var newURL = "https://batdaulaptrinh.com/welcome-to-udemy-extensions/";
    chrome.tabs.create({ url: newURL });
}

function openEnrollCoursePage() {
    chrome.storage.sync.get(['KEY_STORAGE'], function (json) {
        courses = json['KEY_STORAGE']
        if (courses.length > 0) {
            let urlEnroll = getURLEnroll(courses[0])
            chrome.tabs.update({
                url: urlEnroll
            });
        } else if (fetchNextAPINextPage()){
            openEnrollCoursePage()
        }
    });
}

function fetchNextAPINextPage() {
    let currentPage = getCurrentPage()
    if (currentPage < getPages()) {
        setCurrentPage(currentPage + 1)
        fetchAPIAtPageNth(currentPage + 1)
        return true
    }
    return false
}

function sendMessage(msg) {
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

        chrome.tabs.query({ active: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { message: msg });
        });
    });
}

async function fetchAPIAtPageNth(page_nth) {

    let apiUrl = 'https://teachinguide.azure-api.net/course-coupon?sortCol=featured&sortDir=DESC&length=8&page=' + page_nth + '&inkw=&discount=100&language='

    fetch(apiUrl
    ).then((response) => {
        return response.json();
    })
        .then((json) => {
            let courses = getCourse(json)
            chrome.storage.sync.set({ KEY_STORAGE: courses }, function () { });
        }).catch(err => { console.log('encounter error ' + err) });
}

function updateNumberOfPage() {
    let apiUrl = 'https://teachinguide.azure-api.net/course-coupon?sortCol=featured&sortDir=DESC&length=8&page=2&inkw=&discount=100&language='

    fetch(apiUrl
    ).then((response) => {
        return response.json();
    })
        .then((json) => {
            let pages = getPages(json)
            setPages(pages)
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
