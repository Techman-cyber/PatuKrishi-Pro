function openCropModal() {
  openModal("cropModal");
}

async function generateCropAdvice() {
  const location = document.getElementById("cropLocation").value.trim();
  const resultBox = document.getElementById("cropAdviceResult");

  if (!location) {
    resultBox.innerHTML = "<p>Please enter your state.</p>";
    return;
  }

  resultBox.innerHTML = '<div class="shimmer" style="height:20px;"></div>';

  const month = new Date().getMonth() + 1;
  let season = "";
  let crops = [];

  if (month >= 6 && month <= 9) {
    season = "Kharif";
    crops = ["Rice", "Maize", "Cotton"];
  } else if (month >= 10 || month <= 2) {
    season = "Rabi";
    crops = ["Wheat", "Mustard", "Gram"];
  } else {
    season = "Zaid";
    crops = ["Watermelon", "Cucumber"];
  }

  // Try to reuse weather temperature if available
  let tempNote = "Temperature data not available.";

  if (window.lastWeatherTemp != null) {
    const temp = window.lastWeatherTemp;
    tempNote = `Current temperature: ${temp}°C`;
  }

  resultBox.innerHTML = `
    <div class="advice-box">
      <p><strong>Location:</strong> ${location}</p>
      <p><strong>Season:</strong> ${season}</p>
      <p>${tempNote}</p>
      <p><strong>Recommended Crops:</strong></p>
      <ul>
        ${crops.map(c => `<li>${c}</li>`).join("")}
      </ul>
      <p class="muted">
        Advisory based on season and typical Indian climate patterns.
      </p>
    </div>
  `;
}
