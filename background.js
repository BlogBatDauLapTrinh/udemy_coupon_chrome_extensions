let KEY = 'STORAGE'
let NEW_COURSE_KEY = "NEW_COURSE"
chrome.runtime.onInstalled.addListener(function () {
    openWelcomePage()
});

chrome.tabs.onUpdated.addListener(function
    (tabId, changeInfo, tab) {
    chrome.storage.sync.get(['NEW_COURSE_KEY'], function (result) {
        flag = result['NEW_COURSE_KEY']
        if (flag == true) {
            setNewCourseKey(false);
            setTimeout(function () {
                chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

                    chrome.tabs.query({ active: true }, function (tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, { message: 'enroll' });
                    });
                });
                console.log('send message from background to content ' + flag)
            }, 0)
        }
    })

});



chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == 'auto_click') {
        console.log('button click')
        fetchAPI()
        setTimeout(openNewTab, 500);
        setTimeout(function () {
            setNewCourseKey(true);
        }, 500)
        setTimeout(openEnrollCoursePage, 500)

    } else if (request.message == 'complete') {
        removeSuccesfullyEnrollCourse()
        console.log('complete enroll')
        setTimeout(openEnrollCoursePage,1000)
        setTimeout(function () {
            setNewCourseKey(true);
        }, 1000)
        setTimeout(openEnrollCoursePage, 2000)
    }
})



function setNewCourseKey(flag) {
    chrome.storage.sync.set({ NEW_COURSE_KEY: flag }, function () { });
}


function removeSuccesfullyEnrollCourse() {
    chrome.storage.sync.get(['KEY'], function (result) {
        courses = result['KEY']
        courses.shift()
        chrome.storage.sync.set({ "courses": courses }, function () {
            // alert('update data after enroll suceessfully' + courses);
        });
    })
}

async function openNewTab() {
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
    
    chrome.storage.sync.get(['KEY'], function (json) {
        courses = json['KEY']
        if (courses.length > 0) {
            let urlEnroll = getURLEnroll(courses[0])
            console.log('start navigating new course ' + urlEnroll)
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
                console.log('set new course key = true ');
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
