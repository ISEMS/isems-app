import React from "react";

import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { getFormattedDate } from "./utils";
import {Link} from "react-router-dom";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

export default function NodeMap({ nodes }) {
  if (!nodes.length) {
    return <div>Loading...</div>;
  }

  const markers = nodes
    .filter(node => node.latitude && node.longitude)
    .map(node => (
      <Marker position={[node.latitude, node.longitude]} key={node.nodeId}>
        <Popup>
          <div>
            <h1> {node.name}</h1>
            <div>
              <span className="title">Datum:</span>
              {getFormattedDate(node.timestamp)}
            </div>
            <div>
              <span className="title">Batterieladung:</span>
              {node.batteryChargeEstimate}
            </div>
            <div>
              <Link to={`/details/${node.nodeId}`}>Details</Link>
            </div>
          </div>
        </Popup>
      </Marker>
    ));

  return (
    <Map center={[nodes[0].latitude, nodes[0].longitude]} zoom={13}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
      />
      {markers}
    </Map>
  );
}
