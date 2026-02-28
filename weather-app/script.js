const API_KEY = '4d8fb5b93d4af21d66a2948710284366';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const unitToggle = document.getElementById('unitToggle');
const errorMsg = document.getElementById('errorMsg');
const currentWeather = document.getElementById('currentWeather');
const forecast = document.getElementById('forecast');
const forecastCards = document.getElementById('forecastCards');
const historyDropdown = document.getElementById('historyDropdown');
const suggestionsDropdown = document.getElementById('suggestionsDropdown');

let unit = localStorage.getItem('weatherUnit') || 'metric';
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
let currentData = null;
let forecastData = null;
let suggestTimer = null;

updateUnitButton();

// Load last searched city on startup
const lastCity = localStorage.getItem('lastCity');
if (lastCity) {
    cityInput.value = lastCity;
    fetchWeather(lastCity);
}

// Event listeners
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') handleSearch();
});

cityInput.addEventListener('focus', function () {
    if (this.value.trim() === '') showHistory();
});

cityInput.addEventListener('input', function () {
    const query = this.value.trim();
    if (query === '') {
        hideSuggestions();
        showHistory();
    } else {
        hideHistory();
        clearTimeout(suggestTimer);
        suggestTimer = setTimeout(function () {
            fetchSuggestions(query);
        }, 300);
    }
});

document.addEventListener('click', function (e) {
    if (!e.target.closest('.search-box')) {
        hideHistory();
        hideSuggestions();
    }
});

locationBtn.addEventListener('click', function () {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser.');
        return;
    }
    locationBtn.style.opacity = '0.5';
    navigator.geolocation.getCurrentPosition(
        function (pos) {
            locationBtn.style.opacity = '1';
            fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
        },
        function () {
            locationBtn.style.opacity = '1';
            showError('Location access denied. Search by city name instead.');
        }
    );
});

unitToggle.addEventListener('click', function () {
    unit = unit === 'metric' ? 'imperial' : 'metric';
    localStorage.setItem('weatherUnit', unit);
    updateUnitButton();
    if (currentData) {
        renderCurrent(currentData);
        renderForecast(forecastData);
    }
});

function handleSearch() {
    const city = cityInput.value.trim();
    if (!city) return;
    hideHistory();
    hideSuggestions();
    fetchWeather(city);
}

async function fetchWeather(city) {
    showError('');
    currentWeather.classList.add('hidden');
    forecast.classList.add('hidden');

    try {
        const res = await fetch(
            `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
        );
        if (!res.ok) {
            if (res.status === 404) throw new Error('City not found. Check the spelling and try again.');
            throw new Error('Something went wrong. Please try again.');
        }
        currentData = await res.json();

        const fRes = await fetch(
            `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
        );
        if (fRes.ok) forecastData = await fRes.json();

        localStorage.setItem('lastCity', currentData.name);
        addToHistory(currentData.name);
        setWeatherTheme(currentData.weather[0].main);
        renderCurrent(currentData);
        renderForecast(forecastData);
    } catch (err) {
        showError(err.message);
    }
}

async function fetchWeatherByCoords(lat, lon) {
    showError('');
    currentWeather.classList.add('hidden');
    forecast.classList.add('hidden');

    try {
        const res = await fetch(
            `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        if (!res.ok) throw new Error('Could not fetch weather for your location.');
        currentData = await res.json();

        const fRes = await fetch(
            `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        if (fRes.ok) forecastData = await fRes.json();

        cityInput.value = currentData.name;
        localStorage.setItem('lastCity', currentData.name);
        addToHistory(currentData.name);
        setWeatherTheme(currentData.weather[0].main);
        renderCurrent(currentData);
        renderForecast(forecastData);
    } catch (err) {
        showError(err.message);
    }
}

function convertTemp(celsius) {
    if (unit === 'imperial') return Math.round(celsius * 9 / 5 + 32);
    return Math.round(celsius);
}

function windSpeed(ms) {
    if (unit === 'imperial') return (ms * 2.237).toFixed(1) + ' mph';
    return (ms * 3.6).toFixed(1) + ' km/h';
}

function tempSymbol() {
    return unit === 'metric' ? '°C' : '°F';
}

function renderCurrent(data) {
    document.getElementById('weatherIcon').src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    document.getElementById('temperature').textContent = convertTemp(data.main.temp);
    document.getElementById('tempUnit').textContent = tempSymbol();
    document.getElementById('condition').textContent = data.weather[0].description;
    document.getElementById('cityName').textContent = data.name + ', ' + data.sys.country;
    document.getElementById('humidity').textContent = data.main.humidity + '%';
    document.getElementById('wind').textContent = windSpeed(data.wind.speed);
    document.getElementById('feelsLike').textContent = convertTemp(data.main.feels_like) + '°';
    document.getElementById('pressure').textContent = data.main.pressure + ' hPa';

    currentWeather.classList.remove('hidden');
}

function renderForecast(data) {
    if (!data) return;

    forecastCards.innerHTML = '';
    const days = {};

    data.list.forEach(function (item) {
        const date = item.dt_txt.split(' ')[0];
        const today = new Date().toISOString().split('T')[0];
        if (date === today) return;
        if (!days[date]) days[date] = item;
    });

    const entries = Object.values(days).slice(0, 5);

    entries.forEach(function (item) {
        const d = new Date(item.dt * 1000);
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <span class="forecast-day">${dayName}</span>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="${item.weather[0].description}">
            <span class="forecast-temp">${convertTemp(item.main.temp)}°</span>
            <span class="forecast-desc">${item.weather[0].description}</span>
        `;
        forecastCards.appendChild(card);
    });

    forecast.classList.remove('hidden');
}

function setWeatherTheme(condition) {
    const classes = [
        'weather-clear', 'weather-clouds', 'weather-rain',
        'weather-drizzle', 'weather-thunderstorm', 'weather-snow',
        'weather-mist', 'weather-haze', 'weather-fog'
    ];
    document.body.classList.remove(...classes);

    const key = condition.toLowerCase();
    const classMap = {
        clear: 'weather-clear',
        clouds: 'weather-clouds',
        rain: 'weather-rain',
        drizzle: 'weather-drizzle',
        thunderstorm: 'weather-thunderstorm',
        snow: 'weather-snow',
        mist: 'weather-mist',
        haze: 'weather-haze',
        fog: 'weather-fog',
        smoke: 'weather-mist',
        dust: 'weather-mist',
    };

    if (classMap[key]) document.body.classList.add(classMap[key]);
}

function showError(msg) {
    if (!msg) {
        errorMsg.classList.remove('show');
        return;
    }
    errorMsg.textContent = msg;
    errorMsg.classList.add('show');
}

function updateUnitButton() {
    unitToggle.textContent = unit === 'metric' ? '°C' : '°F';
}

function addToHistory(city) {
    searchHistory = searchHistory.filter(function (c) {
        return c.toLowerCase() !== city.toLowerCase();
    });
    searchHistory.unshift(city);
    if (searchHistory.length > 5) searchHistory.pop();
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

function showHistory() {
    if (searchHistory.length === 0) return;
    historyDropdown.innerHTML = '';
    searchHistory.forEach(function (city) {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${city}
        `;
        div.addEventListener('click', function () {
            cityInput.value = city;
            hideHistory();
            fetchWeather(city);
        });
        historyDropdown.appendChild(div);
    });
    historyDropdown.classList.add('show');
}

function hideHistory() {
    historyDropdown.classList.remove('show');
}

async function fetchSuggestions(query) {
    if (query.length < 2) {
        hideSuggestions();
        return;
    }
    try {
        const res = await fetch(
            `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
        );
        if (!res.ok) return;
        const cities = await res.json();
        renderSuggestions(cities);
    } catch (e) {
        // silently fail
    }
}

function renderSuggestions(cities) {
    suggestionsDropdown.innerHTML = '';
    if (cities.length === 0) {
        hideSuggestions();
        return;
    }

    cities.forEach(function (city) {
        const label = city.state
            ? `${city.name}, ${city.state}, ${city.country}`
            : `${city.name}, ${city.country}`;

        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
            <span>${label}</span>
        `;
        div.addEventListener('click', function () {
            cityInput.value = city.name;
            hideSuggestions();
            fetchWeatherByCoords(city.lat, city.lon);
        });
        suggestionsDropdown.appendChild(div);
    });

    suggestionsDropdown.classList.add('show');
}

function hideSuggestions() {
    suggestionsDropdown.classList.remove('show');
}
