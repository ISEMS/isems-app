import React from "react";

import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import {DateTime} from "luxon";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});


const getFormattedDate = (epochString) => {
  const seconds = parseInt(epochString, 10);
  const dt = DateTime.fromMillis(seconds * 1000);
  return dt.toLocaleString(DateTime.DATETIME_SHORT);
}

export default function NodeMap({ nodes }) {
  if (!nodes.length) {
    return <div>Loading...</div>;
  }

  const markers = nodes.map(node => (
    <Marker position={node.position} key={node.name}>
      <Popup>
        <div>
          <h1> {node.name}</h1>
          <div><span className="title">Datum:</span>{getFormattedDate(node.timestamp)}</div>
          <div><span className="title">Batterieladung:</span>{node.batteryChargeEstimate}</div>
          </div>
      </Popup>
    </Marker>
  ));

  return (
    <Map center={nodes[0].position} zoom={13}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
      />
      {markers}
    </Map>
  );
}
