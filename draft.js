function enroll_course (url_coupon)
{
    //auto open url
    this.document.location = url_coupon
    //click enroll
    var btns = document.getElementsByClassName('udlite-btn udlite-btn-large udlite-btn-primary udlite-heading-md styles--btn--express-checkout--28jN4')
    for (var i =0; i<btns.length; i++) 
    btns[i].click();

    // click enroll now

    var btns = document.getElementsByClassName('ellipsis btn btn-lg btn-primary btn-block')
    for (var i =0; i<btns.length; i++) 
    btns[i].click();
}




let url_to_api = 'https://teachinguide.azure-api.net/course-coupon?sortCol=featured&sortDir=DESC&length=12&page=1&inkw=&language=';

fetch(url_to_api)
.then(res => res.json())
.then(out =>{
    window.json_object = out
    // console.log(out)
})


console.log(json_object)


records_total = json_object["recordsTotal"]
results = json_object["results"]

for(const instance of results){
    let couponLink = instance["CouponLink"]
    console.log(couponLink)
}


chrome.storage.sync.set({"results": results}, function() {
    console.log('Value is set to ' + results);
});

chrome.storage.sync.get(['results'], function(result) {
    console.log('Value currently is ' + result.key);
});


let colorButton = document.getElementById('colorButton');
colorButton.onclick = function(button) {
    let color = button.target.value;
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.executeScript(
            tabs[0].id,
            {code: `document.body.style.backgroundColor = '${color}';`}
        );
    })
}


chrome.browserAction.setBadgeText({text: "Hi"});
console.log(`${object.name} created bookmark`);



chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
        console.log(request);
    }
)
chrome.runtime.sendMessage({text: 'Hello from content script'});


//constent.js
let port = chrome.runtime.connect();

port.onMessage.addListener( function(message) {
    console.log(message)
    port.postMessage({message: "send from content"});
    
})

//background.js
chrome.runtime.onConnect.addListener(function(port){
    port.postMessage({number: guess});
    port.onMessage.addListener( function(message) {
        console.log(message.message)
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

function enroll_courses(courses) {
    for (let course of courses) {
        let urlEnroll = getURLEnroll(course)

        chrome.tabs.update({
            url: urlEnroll
        });

        var inputs = document.getElementsByTagName('button');

        for (var i = 0; i < inputs.length; i++) {
            console.log(inputs[i].textContent)
            if (inputs[i]["type"] == 'submit' && inputs[i].textContent == 'Enroll now') {
                inputs[i].click()
            }
        }

    }
}



let apiUrl = 'https://teachinguide.azure-api.net/course-coupon?sortCol=featured&sortDir=DESC&length=1&page=1&inkw=&language='

fetch(apiUrl
).then((response) => {
    return response.json();
})
    .then((json) => {
        let courses = getCourse(json)
        enroll_courses(courses)

    }).catch(err => { console.log(err) });





