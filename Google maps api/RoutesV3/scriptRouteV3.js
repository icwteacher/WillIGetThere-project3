let map;
let directionsService;
let directionsRenderer;
let windFactor = 1.2; // Factor voor wind mee of tegen (kan worden aangepast)

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: { lat: 51.0902, lng: 4.9158 } // Brussel
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);
}

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

          // Bereken de route met de geocodeerde locaties
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
              console.log("Middelpunt coördinaten:", midpoint); // Debugging
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
  const apiKey = 'c985b9e898649a1dca8580b026294c86'; // Vervang dit door je eigen API-sleutel
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`;

  console.log("API URL:", url); // Controleer de URL

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
      const distanceKm = parseFloat(distanceText.replace(/[^\d.]/g, "")); // Verwijder alle niet-numerieke tekens behalve punten
      console.log("Parsed distance (km):", distanceKm); // Debugging
      const batteryNeed = calculateBatteryNeed(distanceKm, windEffect);

      // Update de HTML met batterijinformatie
      const batteryDetails = document.getElementById("battery-details");
      batteryDetails.innerText = `Benodigde energie: ${batteryNeed} Wh`;
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

function calculateBatteryNeed(distanceKm, windEffect) {
  const baseEnergyPerKm = 10; // Basisenergieverbruik in Wh per kilometer
  let energyNeeded;

  if (windEffect === "Wind mee") {
    energyNeeded = distanceKm * baseEnergyPerKm * (1 / windFactor); // Minder energie nodig
  } else if (windEffect === "Wind tegen") {
    energyNeeded = distanceKm * baseEnergyPerKm * windFactor; // Meer energie nodig
  } else {
    energyNeeded = distanceKm * baseEnergyPerKm; // Standaard energieverbruik
  }

  console.log("Energiebehoefte (Wh):", energyNeeded); // Debugging
  return energyNeeded.toFixed(2); // Rond af op 2 decimalen
}

window.onload = initMap;
