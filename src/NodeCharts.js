import { Component } from "react";
import React from "react";
import {
  VictoryLine,
  VictoryChart,
  VictoryZoomContainer,
  VictoryTheme
} from "victory";
import { getFormattedDate } from "./utils";

import "./NodeCharts.css";

const fetchDetails = nodeId => {
  const backendUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const url = `${backendUrl}/measurements/${nodeId}/latest`;
  return fetch(url)
    .then(response => response.json())
    .then(json => json.measurements);
};

const myTheme = VictoryTheme.material;
myTheme.axis.style.grid.stroke = "lightgray";
myTheme.axis.style.grid.strokeDasharray = '10, 0';

function TimeChart({ data, property }) {
  const chartData = data.map(measurement => {
    return {
      x: new Date(measurement.timestamp),
      y: measurement[property]
    };
  });

  return (
    <VictoryChart
      scale={{ x: "time" }}
      theme={myTheme}
      domainPadding={{ y: 10 }}
      containerComponent={<VictoryZoomContainer />}
    >
      <VictoryLine
        data={chartData}
        style={{
          data: { stroke: "#ff8115" },
        }}
      />
    </VictoryChart>
  );
}

function makeCharts(measurements) {
  const properties = [
    "batteryVoltage",
    "batteryChargeEstimate",
    "mppVoltage",
    "batteryTemperature",
    "openCircuitVoltage"
  ];
  return properties.map(p => {
    return (
      <div className="chartGroup" key={p}>
        <h2>{p}</h2>
        <TimeChart data={measurements} property={p} />
      </div>
    );
  });
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
    const charts = this.state.measurements
      ? makeCharts(this.state.measurements)
      : null;

    const latestMeasurement =
      this.state.measurements &&
      getFormattedDate(this.state.measurements[0].timestamp);

    return (
      <div className="node-charts">
        <h1> 24 hour statistics for {this.props.match.params.nodeId} </h1>

        <aside>Latest measurement: {latestMeasurement}</aside>

        <div className="charts">{charts}</div>
      </div>
    );
  }
}
