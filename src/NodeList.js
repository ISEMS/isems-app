import React from "react";
import BatteryAlert from "@material-ui/icons/es/BatteryAlert";
import WatchLater from "@material-ui/icons/es/WatchLater";
import Check from "@material-ui/icons/es/Check";
import { get } from "lodash";

import "./NodeList.css";

import { checkBatteryHealth, checkTime } from "./checks";
import {Link} from "react-router-dom";

function getStatus(data) {
  const checks = [checkTime, checkBatteryHealth];
  let warningStatus;
  for (let check of checks) {
    warningStatus = check(data);
    if (warningStatus) {
      break;
    }
  }
  const okStatus = {
    type: "ok",
    message: "Everything is fine!"
  };
  const status = warningStatus || okStatus;
  return { ...status, data };
}

function getIcon(type) {
  const mapping = {
    timeOffset: <WatchLater />,
    batteryHealth: <BatteryAlert />
  };
  const defaultIcon = <Check />;
  return get(mapping, type, defaultIcon);
}

function Node({ data, type, message }) {
  const icon = getIcon(type);
  const statusClass = type === "ok" ? "" : "error";

  return (
    <li className={`node ${statusClass}`}>
      <Link to={`/details/${data.nodeId}`} className="wrapper">
        <span className="icon">{icon}</span>
        <div className="name"> {data.nodeId} </div>
        <div className="status">{message}</div>
      </Link>
    </li>
  );
}

const errorsFirst = a => (a.type === "ok" ? 1 : -1);

export default function NodeList(props) {
  const nodes = props.nodes
    .map(getStatus)
    .sort(errorsFirst)
    .map(n => (
      <Node
        key={n.data.nodeId}
        data={n.data}
        type={n.type}
        message={n.message}
      />
    ));

  return <ul className="nodeList">{nodes}</ul>;
}
