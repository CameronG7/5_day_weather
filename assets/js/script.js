// element variables 
const currWeatherEl = $("#currentWeather");
const currTempEl = $("#currTemp");
const currWindEl = $("#currWind");
const currHumEl = $("#currHum");
const recentEl = $("#recentSearch");
const cityEl = $("#cityInput");
const dayTempEl = $("#dayTemp");
const dayWindEl = $("#dayWind");
const dayHumEl = $("#dayHum"); 
const searchButtonEl = $("#searchButton");


const MyKey = config.WEATHER_KEY




searchButtonEl.on("click",grabCoord);

function grabCoord(event) // grab json data CAMERON YOU NEED TO FINISH GRABBING COORDS
{
    const UserCity = cityEl.val()
    console.log(UserCity);
    const coordURL = `https://api.openweathermap.org/data/2.5/weather?q=${UserCity}&appid=${MyKey}`;
    fetch (coordURL)
        .then(function(response){
            return response.json()
        })
        .then(function(data){
            console.log(data)
        });
};