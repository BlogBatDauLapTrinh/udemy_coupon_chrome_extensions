let show_coupons = document.getElementById('show_coupons');
show_coupons.onclick = function (button) {
    console.log('navigate to show coupon page')
    var newURL = "https://batdaulaptrinh.com/udemy_coupons/";
    chrome.tabs.create({ url: newURL });
}


let auto_enroll = document.getElementById('auto_enroll')
auto_enroll.onclick = function (button) {
    console.log('click auto enroll')
    chrome.runtime.sendMessage({message: 'auto_click'});
}


