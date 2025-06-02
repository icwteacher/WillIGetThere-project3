import { GOOGLE_API_KEY } from "./config.js";
import { WEATHER_API_KEY } from "./config.js";

let map;
let directionsService;
let directionsRenderer;


function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: { lat: 51.0902, lng: 4.9158 } // Brussel
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);
}
window.initMap = initMap;
window.calculateRoute = calculateRoute;

function calculateRoute() {
  const startAddress = document.getElementById("start").value;
  const endAddress = document.getElementById("end").value;

  const geocoder = new google.maps.Geocoder();

  // Geocode de startlocatie
  geocoder.geocode({ address: startAddress }, function(startResults, startStatus) {
    if (startStatus === 'OK') {
      const startLocation = startResults[0].geometry.location;

      // Geocode de eindlocatie
      geocoder.geocode({ address: endAddress }, function(endResults, endStatus) {
        if (endStatus === 'OK') {
          const endLocation = endResults[0].geometry.location;

          console.log("Startlocatie:", startLocation.toString());
          console.log("Eindlocatie:", endLocation.toString());

          // Bereken de route met de locaties
          const request = {
            origin: startLocation,
            destination: endLocation,
            travelMode: 'BICYCLING' 
          };

          directionsService.route(request, function(result, status) {
            if (status === 'OK') {
              directionsRenderer.setDirections(result);
              const route = result.routes[0].legs[0];
              document.getElementById("distance").innerText = `Afstand: ${route.distance.text}`;

              // Haal het middelpunt op en roep de Weather API aan
              const midpoint = getMidpoint(route);
              saveRoute(startAddress, endAddress, route.distance.text);
              fetchWeatherAt(midpoint.lat(), midpoint.lng(), startLocation, endLocation);

            } else {
              alert('Route niet gevonden');
            }
          });
        } else {
          alert('Eindlocatie niet gevonden: ' + endStatus);
        }
      });
    } else {
      alert('Startlocatie niet gevonden: ' + startStatus);
    }
  });
}

function getMidpoint(leg) {
  const steps = leg.steps;
  const halfwayStep = steps[Math.floor(steps.length / 2)];
  return halfwayStep.end_location; // Dit is een google.maps.LatLng-object
}

function fetchWeatherAt(lat, lng, startLocation, endLocation) {

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${WEATHER_API_KEY}`;



  fetch(url)
    .then(response => {
      console.log("HTTP-status:", response.status); // Controleer de HTTP-status
      if (!response.ok) {
        throw new Error(`HTTP-fout! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("API-respons:", data); // Controleer de API-respons
      const windDir = data.wind.deg;
      const windSpeed = data.wind.speed;

      // Bereken de routehoek
      const routeAngle = calculateRouteAngle(startLocation, endLocation);
      console.log("Routehoek (ten opzichte van het noorden):", routeAngle);
      console.log("Windrichting:", windDir); // Debugging

      // Bepaal het windeffect
      const windEffect = determineWindEffect(routeAngle, windDir);
      console.log("Windeffect:", windEffect); // Debugging

      // Update de HTML met windinformatie
      const windDetails = document.getElementById("wind-details");
      windDetails.innerText = `Windrichting: ${windDir}° | Windsnelheid: ${windSpeed} m/s | Effect: ${windEffect}`;

      // Bereken de batterijbehoefte
      const distanceText = document.getElementById("distance").innerText;
      console.log("Distance text:", distanceText); // Debugging

      // Probeer de afstand te parsen
      // Haal het getal (met decimaal) uit de tekst, vervang komma door punt voor parseFloat
      const match = distanceText.match(/([\d.,]+)/);
      let distanceKm = 0;
      if (match && match[1]) {
        // Haal het getal uit de tekst, vervang komma door punt, parse als float
        distanceKm = parseFloat(match[1].replace(',', '.'));
      }
      // Controleer of distanceKm een geldig getal is
      if (isNaN(distanceKm)) {
        distanceKm = 0;
      }
      console.log("Parsed distance (km):", distanceKm); // Debugging
      const batteryNeed = calculateBatteryNeed(distanceKm, windEffect, windSpeed);

      // Update de HTML met batterijinformatie
      const batteryDetails = document.getElementById("battery-details");
      batteryDetails.innerText = `Benodigde energie: ${batteryNeed} kWh`;
    })
    .catch(error => {
      console.error("Fout bij het ophalen van weergegevens:", error);
      document.getElementById("wind-details").innerText = "Kon windinformatie niet ophalen.";
      document.getElementById("battery-details").innerText = "Kon batterijinformatie niet berekenen.";
    });
}

function calculateRouteAngle(start, end) {
  const deltaY = end.lat() - start.lat();
  const deltaX = end.lng() - start.lng();
  let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI); // Converteer naar graden

  // Corrigeer de hoek om deze ten opzichte van het noorden te berekenen
  angle = (angle + 90) % 360; // Draai de hoek zodat 0° naar het noorden wijst
  if (angle < 0) {
    angle += 360; // Zorg ervoor dat de hoek positief is
  }

  return angle; // Retourneer de hoek ten opzichte van het noorden
}

function determineWindEffect(routeAngle, windDirection) {
  const angleDifference = Math.abs(routeAngle - windDirection) % 360;
  const effectiveAngle = angleDifference > 180 ? 360 - angleDifference : angleDifference;

  if (effectiveAngle <= 45) {
    return "Wind mee";
  } else if (effectiveAngle >= 135) {
    return "Wind tegen";
  } else {
    return "Zijwind";
  }
}

function saveRoute(startLocatie, Eindlocatie, Afstand) {
fetch('routes.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      start: start,
      end: end,
      distance: distance
    }),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Route opgeslagen:', data);
    // Optioneel: geef feedback aan de gebruiker dat de route is opgeslagen
  })
  .catch((error) => {
    console.error('Fout bij opslaan route:', error);
    // Optioneel: geef feedback aan de gebruiker dat het opslaan is mislukt
  });
}

function calculateBatteryNeed(distanceKm, windEffect, windSpeed) {
  const baseEnergyPerKm = 0.0369; // Basisenergieverbruik in KWh per kilometer
  let energyNeeded;

  if (windEffect === "Wind mee") {
    energyNeeded = (distanceKm) * (baseEnergyPerKm * ((0.0351/2.5)*(windSpeed*3.6))); // Minder energie nodig
  } else if (windEffect === "Wind tegen") {
    energyNeeded = (distanceKm) * (baseEnergyPerKm * ((0.0387/2.5)*(windSpeed*3.6))); // Meer energie nodig
  } else {
    energyNeeded = (distanceKm) * baseEnergyPerKm; // Standaard energieverbruik
  }

  console.log("Energiebehoefte (kWh):", energyNeeded); // Debugging
  return (energyNeeded).toFixed(4); // Rond af op 4 decimalen
}

function loadGoogleMapsAPI() {
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&callback=initMap`;
  console.log("google maps api url:", script.src); // Debugging
  script.async = true;
  document.head.appendChild(script);
}

window.onload = loadGoogleMapsAPI;
