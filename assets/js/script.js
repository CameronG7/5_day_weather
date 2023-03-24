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

var recentSearch = JSON.parse(localStorage.getItem("Recent Searches"))
if(recentSearch !== null )
{
	for (var i = 0; i < recentSearch.length; i++) 
	{ 
	// for each score in the array makes a p tag and sets the text to the name and score of the current element then appends to highscore list
	var buttonEl = $('<button>', {"class": "btn btn-secondary", "type": "button" });
	buttonEl.text(`${recentSearch[i].city}`);
	recentEl.prepend(buttonEl);
   }
}

let $cardWeather = ('<div>', {"class": "card m-1 col-12 col-sm" })
function handleSubmit(event) {//handle submit and save score to local storage with user initials
	event.preventDefault();
	console.log("test")
    grabWeather();
    cityEl.val("");

};



recentEl.children().on('click',function(event) {
	event.preventDefault();
	cityEl.val() = event.target.textcontent()
	cityEl.click();
});


$(document).ready(function() {// if user presses enter instead of using the search button, the page functions as if search was pressed
    cityEl.keydown(function(event) {
        if (event.which == 13) {
            event.preventDefault();
			grabWeather();

         }
    });
});

function grabCoord() {
	if (cityEl.val()==""){
		return
	}
	const UserCity = cityEl.val();
	console.log(UserCity);
	const coordURL = `https://api.openweathermap.org/data/2.5/weather?q=${UserCity}&units=imperial&appid=${MyKey}`;
	fetch(coordURL)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			if(data.cod!== 200)
			{
				return
			}
			console.log(data);
			cityEl.val(data.name);
			currWeatherEl.text(`${data.name} (${dayjs.unix(data.dt).format('MM/DD/YYYY')})`)
			currTempEl.text( `${Math.round(data.main.temp)}\u00B0F`)
			currWindEl.text(`${data.wind.speed}mph`)
			currHumEl.text(`${data.main.humidity}%`)
			
			cityLon = data.coord.lon;
			cityLat = data.coord.lat;

		});
       
	
}
function grabWeather() {
	if (cityEl.val()==""){ //cancel if no city input
		return
	}
	recentEl.empty();
	if(recentSearch==null)
	{
		recentSearch =[];
	}
	if (cityEl.val()!=='')
	{
		var newCity =
		{
			"city": cityEl.val(),
		}
		if (newCity.city !== "")
		{
			recentSearch.push(newCity)
			if (recentSearch.length > 10){ //only hold 10 recent search results
				recentSearch.shift();
				
			}
			localStorage.setItem("Recent Searches", JSON.stringify(recentSearch));
		}
	}
	for (var i = 0; i < recentSearch.length; i++) { 
		// for each score in the array makes a p tag and sets the text to the name and score of the current element then appends to highscore list
		var buttonEl = $('<button>', {"class": "btn btn-secondary", "type": "button" });
		buttonEl.text(`${recentSearch[i].city}`);
		recentEl.prepend(buttonEl);
	   
	}
	
    grabCoord();
    setTimeout(function () {
		cityEl.val("");
		if (cityLon ===0 && cityLat ===0){
			return
		}
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
       
    }, 1000)  
	
};
