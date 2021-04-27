import { useState, useEffect, useRef, useContext, useCallback, useMemo } from "react";
import { Context } from '../context/Context';
import { IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import Leaflet from "leaflet";
import ReactDOMServer from 'react-dom/server';
import "leaflet/dist/leaflet.css";
import { iceCreamOutline } from "ionicons/icons";

const center = [51.505, -0.09]
const zoom = 13

const ChangeView = ( {center, zoom} ) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

function DisplayPosition({ map }) {
  const [position, setPosition] = useState(map.getCenter())

  const onClick = useCallback(() => {
    map.setView(center, zoom)
  }, [map])

  const onMove = useCallback(() => {
    setPosition(map.getCenter())
  }, [map])

  useEffect(() => {
    map.on('move', onMove)
    return () => {
      map.off('move', onMove)
    }
  }, [map, onMove])

  return (
    <p>
      latitude: {position.lat.toFixed(4)}, longitude: {position.lng.toFixed(4)}{' '}
      <button onClick={onClick}>reset</button>
    </p>
  )
}




const Entdecken = () => {
  // insert icon
  const iconHTML = ReactDOMServer.renderToString(<IonIcon icon={iceCreamOutline} />)
  const icon = new Leaflet.DivIcon({
    html: iconHTML,
  });

  console.log(icon)

  const [map, setMap] = useState(null)

  console.log(map)

  const displayMap = useMemo(
    () => (
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        whenCreated={setMap}
        className="mapContainer"
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    ),
    [],
  )

  return (
    <IonPage>
      {map ? <DisplayPosition map={map} /> : null}
      {displayMap}
    </IonPage>
  )
};

export default Entdecken;
