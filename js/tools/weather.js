function openWeatherModal() {
  openModal("weatherModal");
}

async function fetchWeather() {
  const city = document.getElementById("weatherCity").value.trim();
  const resultBox = document.getElementById("weatherResult");

  if (!city) {
    resultBox.innerHTML = "<p>Please enter a city name.</p>";
    return;
  }

  resultBox.innerHTML = '<div class="shimmer" style="height:20px;"></div>';

  try {
    // Step 1: Get coordinates
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
    );
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("City not found");
    }

    const { latitude, longitude } = geoData.results[0];

    // Step 2: Get weather
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );
    const weatherData = await weatherRes.json();

    const w = weatherData.current_weather;

    // ✅ STORE TEMPERATURE FOR OTHER TOOLS
    window.lastWeatherTemp = w.temperature;

    resultBox.innerHTML = `
      <div class="weather-box">
        <p><strong>Temperature:</strong> ${w.temperature}°C</p>
        <p><strong>Wind:</strong> ${w.windspeed} km/h</p>
        <p><strong>Condition:</strong> Weather code ${w.weathercode}</p>
      </div>
    `;

    checkWeatherAlerts(w.temperature);
  } catch (err) {
    console.error(err);
    resultBox.innerHTML = "<p>Unable to fetch weather.</p>";
  }
}

function checkWeatherAlerts(temp) {
  const user = firebaseAuth.currentUser;
  if (!user) return;

  db.collection("preferences").doc(user.uid).get()
    .then(doc => {
      if (!doc.exists) return;

      const prefs = doc.data();
      if (!prefs.alerts?.weather) return;

      if (temp > 38) {
        showNotification("🔥 Heat alert! Take crop protection measures.");
      } else if (temp < 5) {
        showNotification("❄️ Cold alert! Frost risk detected.");
      }
    });
}

