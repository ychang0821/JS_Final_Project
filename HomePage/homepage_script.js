const WEATHER_API_URL = 'https://api.weatherbit.io/v2.0/forecast/daily?';
const WEATHER_API_KEY = 'c4b16440bcb0427b9cc88cdce6d66263'
const EVENT_API_URL = 'https://app.ticketmaster.com/discovery/v2/events.json?';
const RESTAURANTS_API_URL = 'https://api.documenu.com/v2/restaurants/search/';

const EVENT_API_KEY ='ULnge4RhAQVQjajspAYnv87RNIGGUZI7';
// const RESTAURANTS_API_KEY = 'a8a15bac1ce132aae9e0e7432be21789';
const RESTAURANTS_API_KEY = '47ad131500db3750319627c17e9bb8c7';
populatePageWithGeolocation();

//takes the user input city and applies it to the NearbyEvents and Weather functions
document.getElementById("city-form").addEventListener("submit", handleSubmit) 

function placeInitialSaveButton() {
    let cityButton = document.createElement("button")
    cityButton.setAttribute("value", "Seattle")
    cityButton.setAttribute("onclick", "submitCity(this.value)")
    cityButton.innerHTML = "Save"

    const parentEl = document.getElementById("save_city");
    parentEl.appendChild(cityButton)
}



function handleSubmit(e) {
    e.preventDefault();
    document.getElementById('save_city').innerHTML = "";
    document.getElementById("city_container_header").innerHTML = "";
    const searchCity = e.target.q.value;
    let cityTitle = document.createElement("h2")
    cityTitle.innerHTML = searchCity;

    

    let cityButton = document.createElement("button")
    cityButton.setAttribute("value", searchCity)
    cityButton.setAttribute("onclick", "submitCity(this.value)")
    cityButton.innerHTML = "Save"

    const parentEl = document.getElementById("save_city");
    parentEl.appendChild(cityTitle)
    parentEl.appendChild(cityButton)
    console.log(searchCity);

    e.target.q.value = "";

    document.getElementById('eventCard_container').innerHTML = "";
    document.getElementById('weatherCard_container').innerHTML = "";
    document.getElementById('restaurants_list_div').innerHTML = "";

    // document.getElementById("city_container_header").innerHTML = "";

    // let cityTitle = document.createElement("h1");
    //     cityTitle.innerText = searchCity;
    //     console.log(cityTitle);
    //     document.getElementById("city_container_header").append(cityTitle);
    getNearbyEvents(searchCity);
    getWeather(searchCity);
    getRestaurants(searchCity);
}

//uses geolocation to populate the page with users local weather, events, and restuarants
function populatePageWithGeolocation() {
    navigator.geolocation.getCurrentPosition(position => {
        const {latitude, longitude} = position.coords;
        getInitialRestaurants(latitude, longitude);
        getInitialWeather(latitude, longitude);
        getInitialEvents(latitude, longitude);
        
    })
}

//called in populatePageWithGeolocation to set up the default page
function getInitialRestaurants(latitude, longitude) {
    fetch(`${RESTAURANTS_API_URL}geo?lat=${latitude}&lon=${longitude}&distance=25&size=3&page=1&key=${RESTAURANTS_API_KEY}`)
    .then(res => res.json())
    .then(result => {
        let cityTitle = document.createElement("h1");
        cityTitle.innerHTML = result.data[0].address.city;
        document.getElementById("city_container_header").append(cityTitle);
        for(let i = 0; i < 3; i++){
            let res = result.data[i];
            let restaurant_div = document.createElement('div')
            restaurant_div.innerHTML = `
            <input type="button" id="${res.restaurant_name}" value="💓" onclick="addRestaurantHandler(this.id)">
            <label for="${res.restaurant_name}">${res.restaurant_name}</label>
            `
            let resultsDiv = document.getElementById("restaurants_list_div");
            resultsDiv.appendChild(restaurant_div);
        }
    });
}
placeInitialSaveButton();
//called in populatePageWithGeolocation to set up the default page
function getInitialWeather(latitude, longitude) {
    fetch(`${WEATHER_API_URL}&lat=${latitude}&lon=${longitude}&key=${WEATHER_API_KEY}&days=7&units=I`)
    .then(res => res.json())
    .then(result => {
        weather_object = {};
        for (let i = 0; i <= 6; i++) {
            const { high_temp, low_temp, valid_date, pop, weather } = result.data[i];
            // console.log(valid_date);
            const date = new Date(valid_date);
            // console.log(date);
            const weekday = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            const dayOfWeek = weekday[date.getDay()];

            const convertedDate = convertDate(result.data[i].valid_date);

            weather_object[i] = { high_temp: high_temp, low_temp: low_temp, valid_date: convertedDate, precipitation: pop, weather: weather }

            const weatherCard = document.createElement("div");
            weatherCard.classList.add("card");
            weatherCard.classList.add("text-center");
            weatherCard.style.width = "9rem";

            weatherCard.innerHTML = `
                <h4>${dayOfWeek}</h4>
                <p>${valid_date}</p>
                <img class="card-img-top" src="../icons/${weather.icon}.png" alt="Card image cap">
            
                <div class="card-body">
            
                <p class="card-text">High: ${high_temp} &#8457</p>
            
                <p class="card-text">Low: ${low_temp} &#8457</p>
            
                <p class="card-text">Precipitation: ${pop} %</p>
            
                </div>
            `
            document.getElementById("weatherCard_container").appendChild(weatherCard);
        }
    })
}

//called in populatePageWithGeolocation to set up the default page
function getInitialEvents(latitude, longitude) {
    fetch(`${EVENT_API_URL}latlong=${latitude},${longitude}&apikey=${EVENT_API_KEY}`)
        .then(res => res.json())
        .then(result => {
            event_object = {};
            for(let i = 0; i<=2; i++) {

                let name = result._embedded.events[i].name;
                let url = result._embedded.events[i].url;
                let event_div = document.createElement('div')
                event_div.innerHTML = `
                <input type="button" id="${name}" value='💓' onclick="addEventHandler(this.id)>
                <label for="${name}">${name}</label>
                <label> <a class="card-text" href="${url}">Order Tickets</a>
                </label>
                `
                let eventsDiv = document.getElementById("eventCard_container");
                eventsDiv.appendChild(event_div)

            }
        })
}

//fetches 3 restaurants near the user input city
function getRestaurants(city) {
    fetch(`${RESTAURANTS_API_URL}fields?address=${city}&key=${RESTAURANTS_API_KEY}`)
    .then(res => res.json())
    .then(result => {
        // console.log(result.data);
        for(let i = 0; i < 3; i++){
            let res = result.data[i];
            let restaurant_div = document.createElement('div')
            restaurant_div.innerHTML = `
            <input type="button" id="${res.restaurant_name}" value="💓" onclick="addRestaurantHandler(this.id)">
            <label for="${res.restaurant_name}">${res.restaurant_name}</label>
            `
            let resultsDiv = document.getElementById("restaurants_list_div");
            resultsDiv.appendChild(restaurant_div);
}
    });
};

//fetches next 7 days weather for desired city from weather api
function getWeather(city){
fetch(`${WEATHER_API_URL}city=${city}&key=${WEATHER_API_KEY}&days=7&units=I`)
    .then(res => res.json())
    .then(result => {
        weather_object = {};
        for (let i = 0; i <= 6; i++) {
            const { high_temp, low_temp, valid_date, pop, weather } = result.data[i];
            // console.log(valid_date);
            const date = new Date(valid_date);
            // console.log(date);
            const weekday = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            const dayOfWeek = weekday[date.getDay()];


            weather_object[i] = { high_temp: high_temp, low_temp: low_temp, valid_date: valid_date, precipitation: pop, weather: weather }

            const weatherCard = document.createElement("div");
            weatherCard.classList.add("card");
            weatherCard.classList.add("text-center");
            weatherCard.style.width = "9rem";

            weatherCard.innerHTML = `
                <h4>${dayOfWeek}</h4>
                <p>${valid_date}</p>
                <img class="card-img-top" src="../icons/${weather.icon}.png" alt="Card image cap">
            
                <div class="card-body">
            
                <p class="card-text">High: ${high_temp} &#8457</p>
            
                <p class="card-text">Low: ${low_temp} &#8457</p>
            
                <p class="card-text">Precipitation: ${pop} %</p>
            
                </div>
            `
            document.getElementById("weatherCard_container").appendChild(weatherCard);
        }
    })
}

//fetches nearby events for desired city from ticketmaster api
    function getNearbyEvents(city) {
        fetch(`${EVENT_API_URL}city=${city}&apikey=${EVENT_API_KEY}`)
        .then(res => res.json())
        .then(result => {
            event_object = {};
            for(let i = 0; i<=2; i++) {
                let name = result._embedded.events[i].name;
                let url = result._embedded.events[i].url;
                let event_div = document.createElement('div')
                event_div.innerHTML = `
                <input type="button" id="${name}" value="💓" onclick="addEventHandler(this.id)">
                <label for="${name}" >${name}</label>
                <label> <a class="card-text" href="${url}">Order Tickets</a>
                </label>
                `
                let eventsDiv = document.getElementById("eventCard_container");
                eventsDiv.appendChild(event_div)
            }
        })
    }

    //converts date from api to (mm-dd-yyyy)
    function convertDate(date) {
        var date = date.split("-");
        var year = date[0];
        var month = date[1];
        var day = date[2];

        var convertedDate = "";

        convertedDate += month + "-" + day + "-" + year;
        return convertedDate;
    }



// async function getResult() {
//     const URL = "http://localhost:3000/"

//     const response = await fetch(URL)
//     const result = await response.json();

//     return result;
// }

// getResult()
//     .then(result => {
//         const message = result.message;
//         const resultDiv = document.createElement("div")
//         resultDiv.innerHTML = `
//             <h4>${message}</h4>
//             `

//         document.getElementById("result_container").appendChild(resultDiv);

//     })

function getCountryCurrency(country) {
    fetch(`https://restcountries.eu/rest/v2/name/${country}`)
    .then(req => req.json())
    .then(data => {
        const currencyCode = data[0].currencies[0].code;
        getCurrencyConversionRate(currencyCode)
    })
}

function getCurrencyConversionRate(currency) {
    fetch("https://v6.exchangerate-api.com/v6/95d8a9ea62e4ba64bb10e0db/latest/USD")
    .then(req => req.json())
    .then(data => {
        const rate = data.conversion_rates[currency];
        // console.log(rate);
        currency_message = document.createElement("p")
        currency_message.innerHTML = `Currency Exchange Rate is ${rate} ${currency} to 1 USD`
        document.getElementById("result_container").append(currency_message)
        })
    }
    // getCountryCurrency("Brazil")

// function calculateCurrency(amount, country) {
//     const currency = getCountryCurrency(country)
//     const rate = getCurrencyConversionRate(currency);
//     return amount * rate;
// }

// console.log(calculateCurrency(70, "japan"))



//restaurants
// const Documenu = require('documenu');
// Documenu.configure('17640bb9c7b77b247a896b12fff962cb');

// console.log(Documenu.Restaurants.getByState('NY'));


const Documenu = require('documenu');
Documenu.configure('17640bb9c7b77b247a896b12fff962cb');

console.log(Documenu.Restaurants.getByState('NY'));

function submitCity(city) {
    const cityInfo = {name: city};
    console.log(cityInfo)
    fetch("https://city-snapshot.herokuapp.com/city/me/cities", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem("token")
        },
        body: JSON.stringify(cityInfo)
    })
    .then((res) => res.json())
    .then(data => {
        alert('Added City to Database');
    })
    .catch((error) => {
        console.error('Error:', error);
    })
}

function addEventHandler(name){
    const eventInfo = {name: name, dates: "", start_time: "", url: "", id: ""};
    fetch("https://city-snapshot.herokuapp.com/event/me/events", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem("token")
        },
        body: JSON.stringify(eventInfo)
    })
    .then((res) => res.json())
    .then(data => {
        alert('Added event to Database');
    })
    .catch((error) => {
        console.error('Error:', error);
    })
}

function addRestaurantHandler(name){
    const restaurantInfo = {name: name};
    fetch("https://city-snapshot.herokuapp.com/restaurant/me/restaurants", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem("token")
        },
        body: JSON.stringify(restaurantInfo)
    })
    .then((res) => res.json())
    .then(data => {
        alert('Added restaurant to Database');
    })
    .catch((error) => {
        console.error('Error:', error);
    })
}


function goToFavorites() {
    document.location.href = './favorites.html'
    renderFavorites()
}

