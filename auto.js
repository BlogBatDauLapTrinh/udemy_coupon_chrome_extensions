couponLink = "https://www.udemy.com/cart/checkout/express/course/3893330/?discountCode=FULLSTACK24"

var newURL = couponLink;
chrome.tabs.create({ url: newURL });

var inputs = document.getElementsByTagName('button');

for(var i = 0; i < inputs.length; i++) {
    console.log(inputs[i].textContent)
    if(inputs[i]["type"] == 'submit'&& inputs[i].textContent =='Enroll now') {
        inputs[i].click()
    }
}

