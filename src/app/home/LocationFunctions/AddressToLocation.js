let geocoder;
export default async function codeAddress(address) {
    geocoder = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyC_9cAGZnlvSGLKRUMCxIgteTpaMvE83oY`)
    geocoder = await geocoder.json();
    // console.log(geocoder.results[0].geometry.location);
    return geocoder.results[0].geometry.location;
  }


  // let geocoder;
  // export default async function codeAddress(address) {
  //     geocoder = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${address}&key=ea3a14c7578f448d887dbc0b6d86990a`);
  
  //     geocoder = await geocoder.json();
  //     console.log(geocoder.results[0].geometry.location);
  //     if (geocoder.status.message == 'OK') {
  //           console.log(geocoder.results[0].geometry);
  //     }
  //   }

