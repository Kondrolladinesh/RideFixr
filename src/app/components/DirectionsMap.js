import { useEffect } from "react";

function loadScript(src, onLoad) {
  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  script.onload = onLoad;
  document.body.appendChild(script);
}

function initMap(origin, destination) {
  const directionsService = new window.google.maps.DirectionsService();
  const directionsRenderer = new window.google.maps.DirectionsRenderer();

  const map = new window.google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: {
      lat: (origin.lat + destination.lat) / 2,
      lng: (origin.lng + destination.lng) / 2,
    },
  });

  directionsRenderer.setMap(map);

  const request = {
    origin: origin,
    destination: destination,
    travelMode: window.google.maps.TravelMode.DRIVING,
  };

  directionsService.route(request, function (result, status) {
    if (status === "OK") {
      directionsRenderer.setDirections(result);
    } else {
      console.error("Error:", status);
    }
  });
}

function DirectionsMap({ origin, destination }) {
  useEffect(() => {
    if (!window.google) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=AIzaSyC_9cAGZnlvSGLKRUMCxIgteTpaMvE83oY&callback=initMap`,
        () => {
          initMap(origin, destination);
        }
      );
    } else {
      initMap(origin, destination);
    }
  }, []);

  return <div id="map" style={{ height: "400px", width: "100%" }}></div>;
}

export default DirectionsMap;
