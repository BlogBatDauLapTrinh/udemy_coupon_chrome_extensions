chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('listening in content' + request.message)
    auto_enroll()
    removeSuccesfullyEnrollCourse()
    // chrome.runtime.sendMessage({ message: 'enroll_successfully' });

})

function sendMessage(message){
    chrome.runtime.sendMessage({ message: message }, function (response) {
        console.log(message.message)
        console.log(response);
      });
}


function removeSuccesfullyEnrollCourse() {
    chrome.storage.sync.get(['courses'], function (courses) {
        courses.shift()
        chrome.storage.sync.set({ "courses": courses }, function () {
            console.log('update data' + courses);
        });
    })
}



function enrollCourse() {
    var inputs = document.getElementsByTagName('button');

    for (var i = 0; i < inputs.length; i++) {
        console.log(inputs[i].textContent)
        if (inputs[i]["type"] == 'submit' && inputs[i].textContent == 'Enroll now') {
            inputs[i].click()
        }
    }

}