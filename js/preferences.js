// Open Preferences Modal
window.openPreferences = function () {
  const user = firebaseAuth.currentUser;

  if (!user) {
    alert("Please login first");
    return;
  }

  loadPreferences(user.uid);
  openModal("prefsModal");
}

// Load preferences from Firestore
async function loadPreferences(uid) {
  try {
    const doc = await db.collection("preferences").doc(uid).get();

    if (!doc.exists) return;

    const prefs = doc.data();

    document.getElementById("prefState").value =
      prefs.location?.state || "";

    document.getElementById("prefCity").value =
      prefs.location?.city || "";

    document
      .querySelectorAll("#prefsModal input[type=checkbox]")
      .forEach(cb => {
        cb.checked = prefs.crops?.includes(cb.value) || false;
      });

    document.getElementById("alertWeather").checked = prefs.alerts?.weather ?? true;
    document.getElementById("alertMandi").checked = prefs.alerts?.mandi ?? true;
    document.getElementById("alertCrop").checked = prefs.alerts?.crop ?? true;
    
  } catch (err) {
    console.error("Failed to load preferences:", err);
  }
}

// Save preferences to Firestore
function savePreferences() {
  const user = firebaseAuth.currentUser;
  if (!user) return;

  const prefs = {
    location: {
      state: document.getElementById("prefState").value.trim(),
      city: document.getElementById("prefCity").value.trim()
    },
    crops: [...document.querySelectorAll("#prefsModal input[type=checkbox][value]")]
      .filter(cb => cb.checked)
      .map(cb => cb.value),
    alerts: {
      weather: document.getElementById("alertWeather").checked,
      mandi: document.getElementById("alertMandi").checked,
      crop: document.getElementById("alertCrop").checked
    },
    updatedAt: new Date()
  };

  db.collection("preferences")
    .doc(user.uid)
    .set(prefs)
    .then(() => {
      closeModal("prefsModal");
      showNotification("Preferences & alerts saved");
    })
    .catch(console.error);
}
