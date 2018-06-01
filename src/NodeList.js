import React, { Component } from "react";
import BatteryAlert from "@material-ui/icons/es/BatteryAlert";
import WatchLater from "@material-ui/icons/es/WatchLater";
import Check from "@material-ui/icons/es/Check";
import { get } from "lodash";

import "./NodeList.css";

import { checkBatteryHealth, checkTime } from "./checks";

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
      <span className="icon">{icon}</span>
      <div className="name"> {data.nodeId} </div>
      <div className="status">{message}</div>
    </li>
  );
}

const errorsFirst = a => (a.type === "ok" ? 1 : -1);

export default class NodeList extends Component {
  render() {
    const nodes = this.props.nodes
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

    return (
      <div>
        <h1>Node Health</h1>

        <ul className="nodeList">{nodes}</ul>
      </div>
    );
  }
}
