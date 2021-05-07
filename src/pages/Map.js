
import { Loader } from '@googlemaps/js-api-loader';
import { Wrapper, Status } from "@googlemaps/react-wrapper";

const Map = () => {
  const mapOptions = {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  }

  const loader = new Loader({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    // libraries: ["places"],
  });

  // const loader = new Loader({
  //   apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  //   libraries: ["places"]
  // });
  
  // Promisegoo
  loader
    .load()
    .then(() => {
      console.log(window.google.maps.Map)
      // new window.google.maps.Map(document.getElementById("map"), mapOptions);
    })
    .catch((error) => {
      console.log(error)
    });
  
  
  // const render = (status) => {
  //   if (status === Status.LOADING) return <div>Loading</div>;
  //   if (status === Status.FAILURE) return <div>Error</div>;
  //   return null;
  // };

  // An error is thrown when instantiating loader with new options
  // try {
  //   new Loader({ apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY});
  // } catch (e) {
  //   console.log(e.message);
  // }

  return (
    <div id="map">
    </div>

    // <Wrapper id='map' apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} render={render}>

    // </Wrapper>    
  )
}

export default Map;