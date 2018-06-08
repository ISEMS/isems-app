import { Component } from "react";
import React from "react";
import {getFormattedDate} from "./utils";

import "./NodeDetails.css"
import Link from "react-router-dom/es/Link";

const fetchDetails = nodeId => {
  const backendUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const url = `${backendUrl}/measurements/${nodeId}/latest`;
  return fetch(url)
    .then(response => response.json())
    .then(json => json.measurements);
};


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

    return (
      <div>
        <h1> Node overview for {this.props.match.params.nodeId} </h1>

        Here we will list some useful information.
        <aside>Latest measurement: {latestMeasurement}</aside>
        <Link to={`/details/${this.props.match.params.nodeId}/charts`}>Show charts</Link>

      </div>
    );
  }
}
