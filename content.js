chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('listening in content' + request)
    auto_enroll()
    remove_succesfully_enroll_course()
    chrome.runtime.sendMessage({ message: 'enroll_successfully' });

})



function remove_succesfully_enroll_course() {
    chrome.storage.sync.get(['courses'], function (courses) {
        courses.shift()
        chrome.storage.sync.set({ "courses": courses }, function () {
            console.log('update data' + courses);
        });
    })
}



function enroll_course() {
    var inputs = document.getElementsByTagName('button');

    for (var i = 0; i < inputs.length; i++) {
        console.log(inputs[i].textContent)
        if (inputs[i]["type"] == 'submit' && inputs[i].textContent == 'Enroll now') {
            inputs[i].click()
        }
    }

}