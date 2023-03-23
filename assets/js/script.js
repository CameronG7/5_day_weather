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
const holderEl = $("#cardHolder");

const MyKey = config.WEATHER_KEY;
var cityLon = 0;
var cityLat = 0;


searchButtonEl.on("click", grabWeather);



let $cardWeather = ('<div>', {"class": "card m-1 col-12 col-sm" })







function grabCoord() {
	
	const UserCity = cityEl.val();
	console.log(UserCity);
	const coordURL = `https://api.openweathermap.org/data/2.5/weather?q=${UserCity}&units=imperial&appid=${MyKey}`;
	fetch(coordURL)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {

			currWeatherEl.text(`${UserCity} (${dayjs.unix(data.dt).format('MM/DD/YYYY')})`)
			currTempEl.text( `${Math.round(data.main.temp)}\u00B0F`)
			currWindEl.text(`${data.wind.speed}mph`)
			currHumEl.text(`${data.main.humidity}%`)
			
			cityLon = data.coord.lon;
			cityLat = data.coord.lat;

		});
       
	
}
function grabWeather() {
	
	localStorage.setItem(cityEl.val(), cityEl.val()) 
    grabCoord();
    setTimeout(function () {
		console.log(cityLat, cityLon);
        
        const weathURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&appid=${MyKey}&units=imperial`;
        console.log(weathURL);
		fetch(weathURL)
			.then(function (response) {
				return response.json();
			})
			.then(function (data) {
				console.log(data);
				let count = 1
				let tempGet=0
				let tempList=[]
				holderEl.empty();
				data.list.forEach(function (element) 
				{	
					
					if(tempGet< element.main.temp)
					{
						tempGet = element.main.temp //search for max temp
					}
					console.log(count, element.main.temp );
					count++
					if (count % 8 === 1) { // use temp get to get the highest temp from teh last 8 time stamps
						 // this is needed but breaks everything
						console.log(tempGet, dayjs.unix(element.dt).format('MM/DD/YYYY') )
						console.log('^should be 8')
						// best situation would be to use tempGet value to find the index in the array and parse weather conditions from that array element but thats tedious 
						var $cardWeather = $('<div>', {"class": "card m-1 col-12 col-sm" })
						var $cardIcon = $('<img>', {"class": "card-img-top", "src": `https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png`})
						var $cardBody = $('<div>', {"class": "card-body"})

						var $cardDay = $('<h5>', {"class": "card-title" })
					
						$cardDay.text(`${dayjs.unix(element.dt).format('MM/DD/YYYY')}`) //

						var $cardTemp = $('<h6>', {"class": "card-text",})
						$cardTemp.text(`Temp: ${Math.round(tempGet)}\u00B0F`)

						var $cardWind = $('<h6>', {"class": "card-text",})
						$cardWind.text(`Wind: ${element.wind.speed}mph`)

						var $cardHum = $('<h6>', {"class": "card-text",})
						$cardHum.text(`Humidity: ${element.main.humidity}%`)

						$cardBody.append([$cardDay, $cardTemp, $cardWind, $cardHum])
						$cardWeather.append([$cardIcon, $cardBody])
						holderEl.append($cardWeather)
						
						tempGet = 0 // reset max temp search

					}

				
				});
			});
       
    }, 500)  
	
};
