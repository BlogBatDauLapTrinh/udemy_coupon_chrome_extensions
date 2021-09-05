chrome.runtime.onInstalled.addListener(function () {
    var newURL = "https://batdaulaptrinh.com/welcome-to-udemy-extensions/";
    chrome.tabs.create({ url: newURL });
});

//background.js
chrome.runtime.onConnect.addListener(function (port) {

    chrome.storage.sync.get(['courses'], function(courses) {
        if (courses.length > 0){
            open_enroll_course(courses[0])
            port.postMessage({ message: courses[0] });
        }
    });

    port.onMessage.addListener(function (message) {



    });
})


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


function open_enroll_course(course){

    console.log(course)
    let urlEnroll = getURLEnroll(course)

    chrome.tabs.update({
        url: urlEnroll
    });
}