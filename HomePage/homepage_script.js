const WEATHER_API_URL = 'https://api.weatherbit.io/v2.0/forecast/daily?city=london&key=c4b16440bcb0427b9cc88cdce6d66263&days=7&units=I';

fetch(WEATHER_API_URL)
    .then(res => res.json())
    .then(result => {
        weather_object = {};
        for (let i = 0; i <= 6; i++) {
            const { high_temp, low_temp, valid_date, pop, weather } = result.data[i];
            console.log(valid_date);
            const date = new Date(valid_date);
            console.log(date);
            const weekday = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            const dayOfWeek = weekday[date.getDay()];


            weather_object[i] = { high_temp: high_temp, low_temp: low_temp, valid_date: valid_date, precipitation: pop, weather: weather }

            const weatherCard = document.createElement("div");
            weatherCard.classList.add("card");
            weatherCard.style.width = "18rem";

            weatherCard.innerHTML = `
                <h4>${dayOfWeek}</h4>
                <p>${valid_date}</p>
                <img class="card-img-top" src="../icons/${weather.icon}.png" alt="Card image cap">
            
                <div class="card-body">
            
                <p class="card-text">High Temperature: ${high_temp} &#8457</p>
            
                <p class="card-text">Low Temperature: ${low_temp} &#8457</p>
            
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