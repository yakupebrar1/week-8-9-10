/**
 * script.js — Weather Dashboard
 */

const cityInput = document.querySelector('#city-input');
const searchBtn = document.querySelector('#search-btn');
const recentBox = document.querySelector('#recent-searches');
const statusMsg = document.querySelector('#status-message');
const currentCard = document.querySelector('#current-weather');
const forecastSection = document.querySelector('#forecast-section');

let isCelsius = true;
let searchHistory = JSON.parse(localStorage.getItem('weather_history')) || [];

// 1. Initialize
function init() {
    renderChips();
    searchBtn.addEventListener('click', () => handleSearch(cityInput.value));
    cityInput.addEventListener('keypress', (e) => e.key === 'Enter' && handleSearch(cityInput.value));
    document.querySelector('#unit-toggle').addEventListener('click', toggleUnits);
}

// 2. Main Search Logic
async function handleSearch(cityName) {
    if (!cityName.trim()) return;

    showStatus('Loading weather data...', 'info');

    try {
        // Geocoding first to get lat/long
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`);
        const geoData = await geoRes.json();

        if (!geoData.results) throw new Error('City not found. Try another.');

        const { latitude, longitude, name, country } = geoData.results[0];

        // Fetch Weather
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&current_weather=true&timezone=auto`);
        const weatherData = await weatherRes.json();

        updateUI(name, country, weatherData);
        addToHistory(name);
        showStatus('', '');

    } catch (error) {
        showStatus(error.message, 'error');
        currentCard.classList.add('hidden');
        forecastSection.classList.add('hidden');
    }
}

// 3. UI Update Functions
function updateUI(city, country, data) {
    currentCard.classList.remove('hidden');
    forecastSection.classList.remove('hidden');

    document.querySelector('#display-city').textContent = `${city}, ${country}`;
    document.querySelector('#display-date').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

    const temp = data.current_weather.temperature;
    document.querySelector('#temp-value').textContent = isCelsius ? `${temp}°` : `${((temp * 9/5) + 32).toFixed(1)}°`;
    document.querySelector('#wind-speed').textContent = `${data.current_weather.windspeed} km/h`;
    document.querySelector('#weather-desc').textContent = getWeatherDesc(data.current_weather.weathercode);

    renderForecast(data.daily);
}

function renderForecast(daily) {
    const container = document.querySelector('#forecast-container');
    container.innerHTML = '';

    daily.time.slice(1, 8).forEach((date, i) => {
        const max = daily.temperature_2m_max[i + 1];
        const min = daily.temperature_2m_min[i + 1];
        const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });

        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <strong>${dayName}</strong>
            <div style="font-size: 1.5rem; margin: 0.5rem 0;">${getWeatherIcon(daily.weathercode[i+1])}</div>
            <p>${isCelsius ? max : ((max * 9/5)+32).toFixed(0)}° / ${isCelsius ? min : ((min * 9/5)+32).toFixed(0)}°</p>
        `;
        container.appendChild(card);
    });
}

// 4. Utility Functions
function showStatus(msg, type) {
    statusMsg.textContent = msg;
    statusMsg.className = type === 'error' ? 'error-text' : 'info-text';
}

function toggleUnits() {
    isCelsius = !isCelsius;
    document.querySelector('#unit-toggle').textContent = isCelsius ? '°C' : '°F';
    // Re-trigger search to update values from the current input or last searched
    handleSearch(document.querySelector('#display-city').textContent.split(',')[0]);
}

function addToHistory(city) {
    if (!searchHistory.includes(city)) {
        searchHistory.unshift(city);
        if (searchHistory.length > 5) searchHistory.pop();
        localStorage.setItem('weather_history', JSON.stringify(searchHistory));
        renderChips();
    }
}

function renderChips() {
    recentBox.innerHTML = '';
    searchHistory.forEach(city => {
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.textContent = city;
        chip.onclick = () => handleSearch(city);
        recentBox.appendChild(chip);
    });
}

function getWeatherDesc(code) {
    const codes = { 0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast', 45: 'Fog' };
    return codes[code] || 'Cloudy';
}

function getWeatherIcon(code) {
    if (code === 0) return '☀️';
    if (code < 3) return '🌤️';
    if (code < 50) return '☁️';
    return '🌧️';
}

init();
