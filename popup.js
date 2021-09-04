let show_coupons = document.getElementById('show_coupons');
show_coupons.onclick = function (button) {
    var newURL = "https://batdaulaptrinh.com/udemy_coupons/";
    chrome.tabs.create({ url: newURL });
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

function enroll_courses(courses) {
    for (let course of courses) {
        console.log(course)
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



let auto_enroll = document.getElementById('auto_enroll')
auto_enroll.onclick = function (button) {
    // chrome.tabs.create({ url: "https://batdaulaptrinh.com/" });

    let apiUrl = 'https://teachinguide.azure-api.net/course-coupon?sortCol=featured&sortDir=DESC&length=10&page=2&inkw=&discount=100&language=&'

    fetch(apiUrl
    ).then((response) => {
        return response.json();
    })
        .then((json) => {
            let courses = getCourse(json)
            enroll_courses(courses)

        }).catch(err => { console.log(err) });
}


