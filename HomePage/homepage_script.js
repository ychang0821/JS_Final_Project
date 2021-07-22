const WEATHER_API_URL = 'https://api.weatherbit.io/v2.0/forecast/daily?city=london&key=c4b16440bcb0427b9cc88cdce6d66263&days=7&units=I';

navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    // Show a map centered at latitude / longitude.
    const RESTAURANTS_API_URL = 'https://api.documenu.com/v2/restaurants/search/geo?lat=' + latitude + '&lon=' + longitude + '&distance=10&size=3&page=1&key=a8a15bac1ce132aae9e0e7432be21789'
    fetch(RESTAURANTS_API_URL)
    .then(res => res.json())
    .then(result => {
        console.log(result.data);
        for(let i = 0; i < 3; i++){
            let res = result.data[i];
            let resultParagraph = document.createElement('p');
            resultParagraph.innerHTML = res.restaurant_name
            let resultsDiv = document.getElementById("restaurants_list_div");
            resultsDiv.append(resultParagraph);
        }
    });
  });
fetch(WEATHER_API_URL)
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


async function getResult() {
    const URL = "http://localhost:3000/"

    const response = await fetch(URL)
    const result = await response.json();

    return result;
}

getResult()
    .then(result => {
        const message = result.message;
        const resultDiv = document.createElement("div")
        resultDiv.innerHTML = `
            <h4>${message}</h4>
            `

        document.getElementById("result_container").appendChild(resultDiv);

    })

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
    getCountryCurrency("Brazil")

// function calculateCurrency(amount, country) {
//     const currency = getCountryCurrency(country)
//     const rate = getCurrencyConversionRate(currency);
//     return amount * rate;
// }
// console.log(calculateCurrency(70, "japan"))