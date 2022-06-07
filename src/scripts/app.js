import config from "./config.js";

const updateWeather = (city, temp, feels_like, humidity) => {
    document.querySelector('.city-name').innerText = city;
    document.querySelector('.temperature-value').innerText = temp
    document.querySelector('.feels-like').innerText = feels_like;
    document.querySelector('.humidity').innerText = humidity;
}

const updateAutoSuggestion = (data) => {
    for (let i = 0; i < 5; i++) {
        let place = data.features[i];
        const element = document.createElement('li')
        element.innerText = place.place_name;
        const autosuggest = document.querySelector('.autosuggestions')
        element.addEventListener('click', () => {
            document.querySelector('.search-bar').value = place.place_name;
            weather.lat = place.center[1];
            weather.lon = place.center[0];
            weather.fetchWeather(place.place_name);
            autosuggest.innerText = ''
            const weatherSelector = document.querySelector('.weather')
            weatherSelector.style.display = 'block';
        })
        autosuggest.appendChild(element)
    }
}

const weather = {
    lat: 25.4358,
    lon: 81.8463,
    units: 'metric',
    fetchWeather: function (city) {
        fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + this.lat + '&lon=' + this.lon + '&units=' + this.units + '&appid=' + config.openWeatherAPIKey)
            .then((response) => response.json())
            .then((data) => updateWeather(city, data.main.temp, data.main.feels_like, data.main.humidity))
            .catch((err) => console.log(err))
    }

}

const autoSuggestion = {
    url: 'https://api.mapbox.com/geocoding/v5/mapbox.places/{search_text}.json',
    getAutoComplete: function (search_text) {
        fetch(this.url.replace('{search_text}', search_text) + '?access_token=' + config.mapBoxAccessToken)
            .then((response) => response.json())
            .then((data) => updateAutoSuggestion(data))
            .catch((err) => {
                const element = document.querySelector('.autosuggestions')
                locationInput.value !== '' ? element.innerHTML = 'No results found' : element.innerHTML = '';
            })
    }
}

const locationInput = document.querySelector('.search-bar')
locationInput.addEventListener('input', (e) => {
    document.querySelector('.autosuggestions').innerHTML = '';
    autoSuggestion.getAutoComplete(e.target.value)
})
locationInput.addEventListener('click', () => {
    locationInput.value = ''
})