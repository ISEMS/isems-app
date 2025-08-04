import React from "react";

import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { getFormattedDate } from "./utils";
import { Link } from "react-router-dom";

import "leaflet/dist/leaflet.css";
import { useTranslation } from "react-i18next";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default function NodeMap({ nodes }) {
  const { t } = useTranslation();

  if (!nodes.length) {
    return <div>{t("globals.loading")}...</div>;
  }

  const markers = nodes
    .filter((node) => node.latitude && node.longitude)
    .map((node) => (
      <Marker position={[node.latitude, node.longitude]} key={node.nodeId}>
        <Popup>
          <div>
            <h1> {node.nodeId}</h1>
            <div>
              <span className="title">{t("globals.date")}:</span>
              {getFormattedDate(node.timestamp)}
            </div>
            <div>
              <span className="title">{t("globals.batteryCharge")}:</span>
              {node.batteryChargeEstimate}
            </div>
            <div>
              <Link to={`/details/${node.nodeId}`}>{t("globals.details")}</Link>
            </div>
          </div>
        </Popup>
      </Marker>
    ));

  return (
    <Map center={[nodes[0].latitude, nodes[0].longitude]} zoom={13}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {markers}
    </Map>
  );
}
