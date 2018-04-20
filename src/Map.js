import React from "react";

import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";

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

  const markers = nodes.map(node => (
    <Marker position={node.position} key={node.name}>
      <Popup>
        <div>
          <h1> {node.name}</h1>
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
