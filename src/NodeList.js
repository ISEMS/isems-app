import React from "react";
import { get, find } from "lodash";

import "./NodeList.sass";

import { checkAll } from "./checks";
import { Link } from "react-router-dom";
import BatteryAlert from "@material-ui/icons/BatteryAlert";
import Check from "@material-ui/icons/Check";
import WatchLater from "@material-ui/icons/WatchLater";
import Error from "@material-ui/icons/Error";
import Loader from "./Loader";

export function getStatus(data) {
  const messages = checkAll(data);
  const firstCritical = find(messages, message => message.type === "critical");
  const firstError = find(messages, message => message.type === "error");
  const firstWarning = find(messages, message => message.type === "warning");
  const okStatus = {
    type: "info",
    name: "ok",
    message: "Everything is fine!"
  };
  const status = firstCritical || firstError || firstWarning || okStatus;
  return { status, data };
}

function getIcon(name) {
  const mapping = {
    timeOffset: <WatchLater />,
    solar_controller_communication: <Error />,
    batteryHealth: <BatteryAlert />,
    batteryCapacity: <BatteryAlert />
  };
  const defaultIcon = <Check />;
  return get(mapping, name, defaultIcon);
}

export function Node({ data, status }) {
  const { name, type, message } = status;
  const icon = getIcon(name);

  return (
    <li className={`node ${type}`}>
      <Link to={`/details/${data.nodeId}`} className="wrapper">
        <span className="icon">{icon}</span>
        <div className="name"> {data.nodeId} </div>
        <div className="status">{message}</div>
      </Link>
    </li>
  );
}

const errorsFirst = (firstNode, secondNode) => {
  const sortOrder = ["critical", "error", "warning", "info"];
  const firstStatus = sortOrder.indexOf(firstNode.status.type);
  const secondStatus = sortOrder.indexOf(secondNode.status.type);
  return firstStatus - secondStatus;
};

export default function NodeList(props) {
  if (props.error) {
    return (
      <div>
        <div className="load-error">
          <Error />
          Could not load data. Make sure your device can reach the data
          collector.
        </div>
      </div>
    );
  }

  if (!props.nodes.length) {
    return <Loader>Loading nodes </Loader>;
  }

  const nodes = props.nodes
    .map(getStatus)
    .sort(errorsFirst)
    .map(n => <Node key={n.data.nodeId} data={n.data} status={n.status} />);

  return <div className="nodeListContainer">
    <ul className="nodeList">{nodes}</ul>
    {props.showsInactiveNodes ? null :
        <button className="showInactiveButton"
                onClick={props.onLoadAllNodes}>
          Also show inactive nodes
        </button>
    }
  </div>;
}
