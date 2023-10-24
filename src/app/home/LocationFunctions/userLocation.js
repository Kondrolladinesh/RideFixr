const getUserLocation = () => {
    const Coords = [];
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            let lat = position.coords.latitude;
            let long = position.coords.longitude;
            // const sCoords = {
            //   latitude: lat,
            //   longitude: long,
            // };
            Coords[0] = lat;
            Coords[1] = long;
            resolve(Coords); // Resolve the promise with the position data
          },
          showError
        );
      } else {
        reject(new Error("Geolocation is not available"));
      }
    });
  };
  

// const getUserLocation=(callback)=>{
//     if(navigator.geolocation){
//         navigator.geolocation.getCurrentPosition((position)=>{
//             let lat = position.coords.latitude;
//             let long = position.coords.longitude;
//             const sCoords = {
//                 latitude: lat,
//                 longitude: long,
//             }
//             callback(sCoords);
//         }, showError);
//     }
// }

// const showposition = (position)=>{
    // let lat = position.coords.latitude;
    // let long = position.coords.longitude;
    // const sCoords = {
    //     latitude: lat,
    //     longitude: long,
    // };
//     // console.log(sCoords);
//      getdata(sCoords);

// }

const showError=(error)=>{
    // console.log(error);
    switch(error.code){
        case error.PERMISSION_DENIED:
            alert("User denied the request for geolocation.")
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred"); 
            break;
        
        default:
            alert("An unknown error occurred");  
    }
}
export default getUserLocation;