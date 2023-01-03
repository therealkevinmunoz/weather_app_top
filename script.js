function retrieveCoordinates(cityName) {
  return new Promise((resolve, reject) => {
    const geocodingURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=f880b1e1506fd2d0feb0ba422baea8b3`;

    if (cityName !== null || cityName !== undefined) {
      fetch(geocodingURL, {
        mode: 'cors',
      }).then((reponse) => reponse.json())
        .then((jsonResponse) => {
          clearError();
          console.log(jsonResponse);
          console.log(`Lat: ${jsonResponse[0].lat}`);
          console.log(`Lon: ${jsonResponse[0].lon}`);

          resolve([jsonResponse[0].lat, jsonResponse[0].lon]);
        })
        .catch((error) => {
          console.log(error);
          displayError();
        });
    } else {
      reject(displayError());
    }
  });
}

function retrieveWeatherData(lat, lon) {
  return new Promise((resolve, reject) => {
    const fahrenheit = 'imperial';
    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${fahrenheit}&appid=f880b1e1506fd2d0feb0ba422baea8b3`;

    if ((lat !== '' && lon !== '') || (lat !== null && lon !== null)) {
      fetch(currentWeatherURL, {
        mode: 'cors',
      }).then((response) => response.json()).then((jsonResponse) => {
        const weatherData = [jsonResponse.main.temp,
          jsonResponse.main.feels_like,
          jsonResponse.main.humidity,
          jsonResponse.weather[0].description,
          jsonResponse.weather[0].main,
          jsonResponse.name];
        resolve(weatherData);
      });
    } else {
      reject(alert('City not found'));
    }
  });
}

function displayWeatherData(weatherArray) {
  return new Promise(() => {
    const mainTemp = document.getElementById('mainTemp');
    const feelsLike = document.getElementById('feelsLike');
    const humidity = document.getElementById('humidity');
    const weatherDescription = document.getElementById('weatherDescription');
    const weatherType = document.getElementById('weatherType');
    const cityTitle = document.getElementById('cityTitle');

    mainTemp.textContent = weatherArray[0];
    feelsLike.textContent = weatherArray[1];
    humidity.textContent = weatherArray[2];
    weatherDescription.textContent = weatherArray[3];
    weatherType.textContent = weatherArray[4];
    cityTitle.textContent = weatherArray[5];
  });
}

function displayError() {
  const errorField = document.getElementById('error');
  errorField.textContent = 'We could not find your city. Try again.';
  errorField.style.padding = '10px';
}

function clearError() {
  const errorField = document.getElementById('error');
  errorField.textContent = '';
  errorField.style.removeProperty('padding');
}

const cityNameField = document.getElementById('cityName');

cityNameField.addEventListener('search', () => {
  if (cityNameField.value !== '') {
    retrieveCoordinates(cityNameField.value)
      .then((response) => retrieveWeatherData(response[0], response[1]))
      .then((response) => displayWeatherData(response))
      .catch((error) => {
        console.log(error);
        displayError();
      });
  }
});

window.addEventListener('load', () => {
  retrieveCoordinates('Los Angeles')
    .then((response) => retrieveWeatherData(response[0], response[1]))
    .then((response) => displayWeatherData(response))
    .catch((error) => {
      console.log(error);
      displayError();
    });
});
