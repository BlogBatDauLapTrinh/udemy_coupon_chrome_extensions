chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
        console.log('listening in content' + request)
{
        auto_enroll()
        remove_succesfully_enroll_course()
        chrome.runtime.sendMessage({message: 'enroll_successfully'});
        }
    }
)




function remove_succesfully_enroll_course(){
    chrome.storage.sync.get(['courses'], function(courses){
        courses.shift()
        chrome.storage.sync.set({ "courses": courses }, function () {
            console.log('Value is set to ' + courses);
        });
    })
}


function fetchAPI(){

    let apiUrl = 'https://teachinguide.azure-api.net/course-coupon?sortCol=featured&sortDir=DESC&length=10&page=2&inkw=&discount=100&language=&'

    fetch(apiUrl
    ).then((response) => {
        return response.json();
    })
        .then((json) => {
            let courses = getCourse(json)
            // enroll_courses(courses)
            chrome.storage.sync.set({ "courses": courses }, function () {
                console.log('Value is set to ' + courses);
            });

        }).catch(err => { console.log(err) });
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