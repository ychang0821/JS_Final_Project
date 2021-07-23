const WEATHER_API_URL = 'https://api.weatherbit.io/v2.0/forecast/daily?';
const WEATHER_API_KEY = 'c4b16440bcb0427b9cc88cdce6d66263'

function goToFavorites() {
    document.location.href = '../FavoritesPage/index.html'
}

function renderFavorites() {
    fetch("https://city-snapshot.herokuapp.com/user/me", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem("token")
        },
    })
        .then((res) => res.json())
        .then(data => {
            console.log(data)
            let citiesArr = data.cities;
            let restaurantArr = data.restaurants;
            let eventsArr = data.events;
            
            for(let i = 0; i < restaurantArr.length; i++){
                let res = restaurantArr[i];
                let restaurant_div = document.createElement('div')
                restaurant_div.innerHTML = `
                <input type="checkbox" id="${res.name}" onchange="deleteRestaurantHandler('${res._id}')" checked>
                <label for="${res.name}">${res.name}</label>
                `
                let resultsDiv = document.getElementById("restaurants_list_div");
                resultsDiv.appendChild(restaurant_div);
            }

            for(let i = 0; i<eventsArr.length; i++) {
                let name = eventsArr[i].name;
                const id = eventsArr[i]._id;
                let event_div = document.createElement('div')
                event_div.innerHTML = `
                <input type="checkbox" id="${name}" onchange="deleteEventHandler('${id}')"checked>
                <label for="${name}">${name}</label>
                `
                let eventsDiv = document.getElementById("eventCard_container");
                eventsDiv.appendChild(event_div)
            }

            for (let i = 0; i < citiesArr.length; i++) {

                const newButton = document.createElement("button")
                newButton.setAttribute("value", citiesArr[i].name)
                newButton.setAttribute("onclick", "getWeather(this.value)")
                newButton.setAttribute("class", "btn btn-primary")
                newButton.innerHTML = citiesArr[i].name
                document.getElementById("favorites_city_container").appendChild(newButton)

                const newDeleteButton = document.createElement("button")
                newDeleteButton.setAttribute("value", citiesArr[i]._id)
                newDeleteButton.setAttribute("class", "btn btn-danger")
                
                newDeleteButton.setAttribute("onclick", "deleteCityHandler(this.value)")
                newDeleteButton.innerHTML = `Delete ${citiesArr[i].name}`
                document.getElementById("favorites_city_container").appendChild(newDeleteButton)
            }

        })
        .catch((error) => {
            console.error('Error:', error);
        })
}

function updateCard(){}

function getWeather(city){
    document.getElementById('weatherCard_container').innerHTML = "";
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

function goToHome() {
    document.location.href = './index.html'
}

renderFavorites()

function deleteCityHandler(id) {
    const idInfo = {_id: id}
    fetch('https://city-snapshot.herokuapp.com/city/me/cities', {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem("token")
        },
        body: JSON.stringify(idInfo)
    })
    .then(response => response.json())
    .then(data => {
        alert(`Deleted City`);
        document.location.href = 'favorites.html'
    })
    .catch((error) => {
        console.error('Error:', error);
    })
}

function deleteRestaurantHandler(id) {
    const idInfo = {_id: id}
    fetch('https://city-snapshot.herokuapp.com/restaurant/me/restaurants', {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem("token")
        },
        body: JSON.stringify(idInfo)
    })
    .then(response => response.json())
    .then(data => {
        alert(`Deleted Restaurants`);
        document.location.href = 'favorites.html'
    })
    .catch((error) => {
        console.error('Error:', error);
    })
}

function deleteEventHandler(id) {
    const idInfo = {_id: id}
    fetch('https://city-snapshot.herokuapp.com/event/me/events', {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem("token")
        },
        body: JSON.stringify(idInfo)
    })
    .then(response => response.json())
    .then(data => {
        alert(`Deleted Event`);
        document.location.href = 'favorites.html'
    })
    .catch((error) => {
        console.error('Error:', error);
    })
}