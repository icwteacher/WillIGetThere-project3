let map;
let directionsService;
let directionsRenderer;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 7,
    center: { lat: 50.8503, lng: 4.3517 } // Brussel
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
              document.getElementById("info").innerText = `Afstand: ${route.distance.text}`;

              // Haal het middelpunt op en roep de Weather API aan
              const midpoint = getMidpoint(route);
              console.log("Middelpunt coördinaten:", midpoint); // Debugging
              fetchWeatherAt(midpoint.lat(), midpoint.lng());
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

function fetchWeatherAt(lat, lng) {
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

      const windDetails = document.getElementById("wind-details");
      windDetails.innerText = `Windrichting: ${windDir}°, Windsnelheid: ${windSpeed} m/s`;
    })
    .catch(error => {
      console.error("Fout bij het ophalen van weergegevens:", error);
      document.getElementById("wind-details").innerText = "Kon windinformatie niet ophalen.";
    });
}

window.onload = initMap;
