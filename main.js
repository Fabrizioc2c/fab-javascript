const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

// variables of the form 

const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
var inputValue;



const weather = {};

weather.temperature = {
    unit: "celsius"
}


const key = "5592128f62ae0bf71e7b939a95d8465c";

if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    form.addEventListener("submit", function(){
        inputValue =  input.value;
      });
    getWeather(latitude, longitude, inputValue );
}

form.addEventListener("submit", function(){
    inputValue =  input.value;
    getWeather('', '', inputValue );
  });

function showError(error) {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

function getWeather(latitude, longitude, inputValue) {
  var api = `http://api.openweathermap.org/data/2.5/weather?&lat=${latitude}&lon=${longitude}&appid=${'5592128f62ae0bf71e7b939a95d8465c'}&units=metric`;

    // if (inputValue != null){
    //     var api = `http://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${'5592128f62ae0bf71e7b939a95d8465c'}&units=metric`;


    // } else {
    //     var api = `http://api.openweathermap.org/data/2.5/weather?&lat=${latitude}&lon=${longitude}&appid=${'5592128f62ae0bf71e7b939a95d8465c'}&units=metric`;

    // }

    // let api = `http://api.openweathermap.org/data/2.5/weather?&lat=${latitude}&lon=${longitude}&appid=${'5592128f62ae0bf71e7b939a95d8465c'}&units=metric`;
    // https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric
    //emperature is available in Fahrenheit, Celsius and Kelvin units.

    //For temperature in Fahrenheit use units=imperial
    //For temperature in Celsius use units=metric
    //     console.log(api) }
    fetch(api)
        .then(function (response) {
            let data = response.json();
            return data;
        })
        .then(function (data) {
        //weather.temperature.value = Math.floor(data.main.temp - KELVIN);  
            weather.temperature.value = data.main.temp;
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function () {
            displayWeather();
        });
}

function displayWeather() {
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}


// function 
function changeBackground() {
 var div_card = document.querySelector(".cards");
 var div_info = document.querySelector(".info");
 div_card.style.background  = "red";
 div_info.style.display = "block";}


const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");

const apiKey = "5592128f62ae0bf71e7b939a95d8465c";

form.addEventListener("submit", e => {
  e.preventDefault();
  let inputVal = input.value;

  //check if there's already a city
  const listItems = list.querySelectorAll(".ajax-section .city");
  const listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter(el => {
      let content = "";
      //athens,gr
      if (inputVal.includes(",")) {
        //athens,grrrrrr->invalid country code, so we keep only the first part of inputVal
        if (inputVal.split(",")[1].length > 2) {
          inputVal = inputVal.split(",")[0];
          content = el
            .querySelector(".city-name span")
            .textContent.toLowerCase();
        } else {
          content = el.querySelector(".city-name").dataset.name.toLowerCase();
        }
      } else {
        //athens
        content = el.querySelector(".city-name span").textContent.toLowerCase();
      }
      return content == inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) {
      msg.textContent = `You already know the weather for ${
        filteredArray[0].querySelector(".city-name span").textContent
      } ...otherwise be more specific by providing the country code as well 😉`;
      form.reset();
      input.focus();
      return;
    }
  }

  //ajax here
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const { main, name, sys, weather } = data;
      const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
        weather[0]["icon"]
      }.svg`;

      const li = document.createElement("li");
      li.classList.add("city");
      const markup = `
      <button class="button-card" type="button" onclick="changeBackground()" >
        <h2 class="city-name" data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
        </h2>
       
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
          <img class="city-icon" src="${icon}" alt="${
        weather[0]["description"]
      }">
          <figcaption>${weather[0]["description"]}</figcaption>
        </figure>  </button>
      `;
      li.innerHTML = markup;
      list.appendChild(li);
    })
    .catch(() => {
      msg.textContent = "Please search for a valid city 😑";
    });

  msg.textContent = "";
  form.reset();
  input.focus();
});