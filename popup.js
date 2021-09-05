let show_coupons = document.getElementById('show_coupons');
show_coupons.onclick = function (button) {
    var newURL = "https://batdaulaptrinh.com/udemy_coupons/";
    chrome.tabs.create({ url: newURL });
}


let auto_enroll = document.getElementById('auto_enroll')
auto_enroll.onclick = function (button) {
    // chrome.tabs.create({ url: "https://batdaulaptrinh.com/" });

    chrome.runtime.sendMessage({message: 'auto'});
}


