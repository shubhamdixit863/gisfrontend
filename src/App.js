import * as React from 'react';
import Slider from 'react-input-slider';
import './App.css';  // Assuming you have an App.css file for styling
import { Map,Marker,Popup } from 'react-map-gl';
import axios from 'axios';

const api="http://localhost:8080/gis"
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

  const [state, setState] = React.useState({  x: 100 });
  const [showPopup,setShowPopup]=React.useState({})
  const fetchGisData=(mapEvent,id)=>{
    console.log(mapEvent.target._lngLat,id);
    
    // call the api fetch the data 
    axios.post(api,{latitude:mapEvent.target._lngLat.lat,longitude:mapEvent.target._lngLat.lng,distance:state.x})
    .then(res=>{
      setShowPopup({[id]:`TotalPopulation: ${res.data.total_population} AverageIncome: ${res.data.average_income}`})
    }).catch(err=>{
      console.log(err);
    })

  }
  const closePopup=(id)=>{
      
       let obj={...showPopup};
       delete obj[id];
       setShowPopup(obj)

  }
 
  return (
    <div className="app-container">
       <h1 className="heading">GIS Data</h1>
     <div  className="map-container">
       <Map
    mapboxAccessToken="pk.eyJ1IjoibG9nYW4xMjM0IiwiYSI6ImNscmRmbW5jcDB5dzMya3Z4ZXk2cm8ydW4ifQ.oaD00gUhC99sHUmKqr1SLw"
    initialViewState={{
      longitude: -122.4,
      latitude: 37.8,
      zoom: 5
    }}
    style={{width: 800, height: 800}}
    mapStyle="mapbox://styles/mapbox/streets-v9"
  >
    {
      coordinatesList.map(ele=>(
        <div key={ele.id}>
         <Marker longitude={ele.lng} latitude={ele.lat} anchor="bottom" onClick={(event)=>fetchGisData(event,ele.id)} >
        <img src="/pin.png"  width={"80px"} height={"80px"} style={{cursor:"pointer"}}/>
      </Marker>
      { 
          showPopup[ele.id] ?
            <Popup longitude={ele.lng} latitude={ele.lat}
              anchor="bottom"
              onClose={() => closePopup(ele.id)}>
             { showPopup[ele.id]}
            </Popup>:""

         }
        </div>
       
     
      
      
      ))
    }

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
