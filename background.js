chrome.runtime.onInstalled.addListener(function () {
    var newURL = "https://batdaulaptrinh.com/welcome-to-udemy-extensions/";
    chrome.tabs.create({ url: newURL });
});

//background.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('listening in background' + request)
    if (request.message == 'fetch_successfully' || request.message == 'enroll_successfully'){
        chrome.storage.sync.get(['courses'], function(courses) {
            if (courses.length > 0){
                open_enroll_course(courses[0])
                chrome.runtime.sendMessage({ message: courses[0] });
            }
        });
    }

    else if (request.message == 'auto_click'){
        chrome.tabs.update({
            url: 'http://batdaulaptrinh.com/'
        });
        fetchAPI()
        chrome.runtime.sendMessage({message: 'fetch_successfully'});
        
    }
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