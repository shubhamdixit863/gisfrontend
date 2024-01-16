import * as React from 'react';
import Slider from 'react-input-slider';
import './App.css';  // Assuming you have an App.css file for styling
import { Layer, Map,Marker,Popup, Source } from 'react-map-gl';
import axios from 'axios';

const api="http://ec2-18-209-60-140.compute-1.amazonaws.com:8080/gis"
const localapi="http://localhost:8080/gis"

const coordinatesList = [
  { id: 'newYork', lat: 40.7128, lng: -74.0060, city: "New York" },
  { id: 'losAngeles', lat: 34.0522, lng: -118.2437, city: "Los Angeles" },
  { id: 'chicago', lat: 41.8781, lng: -87.6298, city: "Chicago" },
  { id: 'houston', lat: 29.7604, lng: -95.3698, city: "Houston" },
  { id: 'phoenix', lat: 33.4484, lng: -112.0740, city: "Phoenix" },
  { id: 'philadelphia', lat: 39.9526, lng: -75.1652, city: "Philadelphia" },
  { id: 'sanAntonio', lat: 29.4241, lng: -98.4936, city: "San Antonio" },
  { id: 'sanDiego', lat: 32.7157, lng: -117.1611, city: "San Diego" },
  { id: 'dallas', lat: 32.7767, lng: -96.7970, city: "Dallas" },
  { id: 'sanFrancisco', lat: 37.7749, lng: -122.4194, city: "San Francisco" }
];


function App() {

  const [geojsonData, setGeojsonData] = React.useState({
    type: 'FeatureCollection',
    features: [], // Initially empty, will be updated with API data
  });

  React.useEffect(() => {
    fetchYourApi().then(polygonData => {
      const features = polygonData.map(polygon => ({
        type: 'Feature',
        geometry: JSON.parse(polygon)
      }));

      setGeojsonData({
        type: 'FeatureCollection',
        features: features
      });
      setIsLoading(false); 

    });
  }, []);

  const polygonLayerStyle = {
    id: 'polygon',
    type: 'fill',
    paint: {
      'fill-color': '#007cbf',
      'fill-opacity': 0.8
    }
  };

  const [state, setState] = React.useState({  x: 100 });
  const [showPopup,setShowPopup]=React.useState({})
  const [isLoading, setIsLoading] = React.useState(true); // Loader state
  const [popupInfo, setPopupInfo] = React.useState({
    show: false,
    latitude: null,
    longitude: null,
    content: ''
  });
  const fetchGisData=(event)=>{
    const { lng, lat } = event.lngLat;
    
    // call the api fetch the data 
    axios.post(api,{latitude:lat,longitude:lng,distance:state.x})
    .then(response=>{
      setPopupInfo({
        show: true,
        latitude: lat,
        longitude: lng,
        content: `TotalPopulation: ${response.data.total_population} AverageIncome: ${response.data.average_income}`
      });
    }).catch(err=>{
      console.log(err);
    })

  }

  async function fetchYourApi() {
    const data=await axios.get(localapi);
    return data.data;
  }
  const closePopup=(id)=>{
      
       let obj={...showPopup};
       delete obj[id];
       setShowPopup(obj)

  }
 
  return (
    <div className="app-container">
       <h1 className="heading">GIS Data</h1>
       {isLoading && <div className="loader"></div>} {/* Loader */}

     <div  className="map-container">
       <Map
       onClick={fetchGisData}
    mapboxAccessToken="pk.eyJ1IjoibG9nYW4xMjM0IiwiYSI6ImNscmRmbW5jcDB5dzMya3Z4ZXk2cm8ydW4ifQ.oaD00gUhC99sHUmKqr1SLw"
    initialViewState={{
      longitude:  -96.454968 ,
      latitude: 33.332216,
      zoom: 8
    }}
    style={{width: 800, height: 800}}
    mapStyle="mapbox://styles/mapbox/streets-v9"
  >
     <Source id="my-data" type="geojson" data={geojsonData} >
        <Layer {...polygonLayerStyle}  />
      </Source>


      {popupInfo.show && (
            <Popup
              latitude={popupInfo.latitude}
              longitude={popupInfo.longitude}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setPopupInfo({ ...popupInfo, show: false })}
            >
              {popupInfo.content}
            </Popup>
          )}

  </Map>
 
    </div>
    <div className="slider-container">
      <h2>Distance in Miles</h2>
      {state.x}
    <Slider
        axis="x"
        x={state.x}
        onChange={({ x }) => setState(state => ({ ...state, x }))}
      />    </div>
    </div>
   
 
  );
}
export default App;
