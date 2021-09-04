let container_div = document.getElementById('container');
let apiUrl = 'https://teachinguide.azure-api.net/course-coupon?sortCol=featured&sortDir=DESC&length=300&page=1&inkw=&language='

fetch(apiUrl
).then((response)=>{
      return response.json();
  })
  .then((json) => {
      let courses = json["results"]
      for(let course of courses){

        //   let img = document.createElement('img');
        //   img.src = course["ImageUrl"]
        //   img.setAttribute('height','240px')
        //   img.setAttribute('width','320px')
          
          let span_title = document.createElement('span')
          title = course['Title']
          span_title.textContent=title;
          container_div.append(title)
        //   container_div.appendChild(image);
          container_div.appendChild(document.createElement("br"));
      }
      chrome.storage.sync.set({courses:courses });
  })
  .catch(err=>{console.log(err)});