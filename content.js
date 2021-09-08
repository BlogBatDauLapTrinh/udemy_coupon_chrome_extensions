chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    alert('In content message is' + request.message) 
    if(request.message == 'enroll'){
        setTimeout(function() {
            auto_enroll();
        }, 1000)
        removeSuccesfullyEnrollCourse()
        chrome.runtime.sendMessage({ message: 'complete' });
    }
})



function sendMessage(msg){
    chrome.runtime.sendMessage({ message: msg }, function (response) {
        alert('send message from content (message : ' + msg + ') + ( respone : ' + response +' )')
      });
}


function removeSuccesfullyEnrollCourse() {
    chrome.storage.sync.get(['courses'], function (courses) {
        courses.shift()
        chrome.storage.sync.set({ "courses": courses }, function () {
            alert('update data after enroll suceessfully' + courses);
        });
    })
}



function enrollCourse() {
    var inputs = document.getElementsByTagName('button');

    for (var i = 0; i < inputs.length; i++) {
        alert(inputs[i].textContent)
        if (inputs[i]["type"] == 'submit' && inputs[i].textContent == 'Enroll now') {
            inputs[i].click()
        }
    }

}