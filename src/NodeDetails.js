import { Component } from "react";
import React from "react";
import {getFormattedDate} from "./utils";
import {Check, Warning, Error} from "@material-ui/icons"
import {groupBy} from "lodash"

import "./NodeDetails.css"
import Link from "react-router-dom/es/Link";
import {checkAll} from "./checks";

const fetchDetails = nodeId => {
  const backendUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const url = `${backendUrl}/measurements/${nodeId}/latest`;
  return fetch(url)
    .then(response => response.json())
    .then(json => json.measurements);
};

function getIcon(type){
  const mapping = {
    "error": <Error />,
    "warning": <Warning />,
    "info": <Check/>
  };
  return mapping[type];
}

function Message({status}){
  const icon = getIcon(status.type);
  return <li> {icon} {status.message} </li>
}


export default class NodeCharts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      measurements: null
    };
  }

  componentDidMount() {
    fetchDetails(this.props.match.params.nodeId).then(measurements =>
      this.setState({ measurements })
    );
  }

  render() {
    const latestMeasurement = this.state.measurements && getFormattedDate(this.state.measurements[0].timestamp);
    const messages = this.state.measurements && checkAll(this.state.measurements[0]);
    const types = {info: [], warning: [], error: []};

    const groups = groupBy(messages, "type");
    const displayMessages = {...types, ...groups};

    return (
      <div className="node-details">
        <h1> {this.props.match.params.nodeId} </h1>

        <ul className="status errors">
          {displayMessages.error.map(status => <Message key={status.name} status={status} />)}
        </ul>
        <ul className="status warnings">
          {displayMessages.warning.map(status => <Message key={status.name} status={status} />)}
        </ul>
        <ul className="status infos">
          {displayMessages.info.map(status => <Message key={status.name} status={status} />)}
        </ul>
        <Link to={`/details/${this.props.match.params.nodeId}/charts`}>Show charts</Link>

      </div>
    );
  }
}
