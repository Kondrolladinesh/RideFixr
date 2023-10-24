function degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
}

export default function calcDistance(startingCoords, destinationCoords) {
    const startingLat = degreesToRadians(startingCoords.latitude);
    const startingLong = degreesToRadians(startingCoords.longitude);
    const destinationLat = degreesToRadians(destinationCoords.latitude);
    const destinationLong = degreesToRadians(destinationCoords.longitude);

    // Radius of the Earth in kilometers
    const radius = 6371; // Changed radius to the correct value (mean Earth radius)

    // Haversine equation
    const deltaLat = destinationLat - startingLat;
    const deltaLong = destinationLong - startingLong;
    const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(startingLat) * Math.cos(destinationLat) * Math.sin(deltaLong / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distanceInKilometers = radius * c;
    return distanceInKilometers;
}

// const sCoords = {
//     latitude: 26.834379770873042,
//     longitude: 75.65173110786674,
//   };
//   const dCoords = {
//       latitude: 28.7041,
//       longitude: 77.1025,
//   };
  
//   const dist = calcDistance(sCoords, dCoords);
//   console.log(dist);