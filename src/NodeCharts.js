import { Component } from "react";
import React from "react";
import {
  VictoryLine,
  VictoryChart,
  VictoryZoomContainer,
  VictoryBrushContainer
} from "victory";
import { getFormattedDate } from "./utils";

import "./NodeCharts.css";
import * as PropTypes from "prop-types";

const fetchDetails = nodeId => {
  const backendUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const url = `${backendUrl}/measurements/${nodeId}/latest`;
  return fetch(url)
    .then(response => response.json())
    .then(json => json.measurements);
};

class TimeChart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleZoom(domain) {
    this.setState({ selectedDomain: domain });
  }

  handleBrush(domain) {
    this.setState({ zoomDomain: domain });
  }

  render() {
    let { data, property } = this.props;
    const chartData = data.map(measurement => {
      return {
        x: new Date(measurement.timestamp),
        y:
          Math.abs(
            Math.sin(
              new Date(measurement.timestamp).valueOf() * property.charCodeAt(7)
            )
          ) * 1000
        // y: measurement[property]
      };
    });
    const style = { data: { stroke: "094c82" } };

    const zoomData = chartData.filter(entry => entry.x.getMinutes() === 0);

    return (
      <div>
        <VictoryChart
          scale={{ x: "time" }}
          containerComponent={
            <VictoryZoomContainer
              responsive={false}
              zoomDimension="x"
              zoomDomain={this.state.zoomDomain}
              onZoomDomainChange={this.handleZoom.bind(this)}
            />
          }
        >
          <VictoryLine style={style} data={chartData} />
        </VictoryChart>

        Zoom:
        <VictoryChart
          padding={{ top: 0, left: 50, right: 50, bottom: 30 }}
          height={90}
          scale={{ x: "time" }}
          containerComponent={
            <VictoryBrushContainer
              responsive={false}
              brushDimension="x"
              brushDomain={this.state.selectedDomain}
              onBrushDomainChange={this.handleBrush.bind(this)}
            />
          }
        >
          <VictoryLine style={style} data={zoomData} />
        </VictoryChart>
      </div>
    );
  }
}

TimeChart.propTypes = {
  data: PropTypes.any,
  property: PropTypes.string.isRequired
};

function makeCharts(measurements) {
  const properties = [
    "batteryVoltage",
    "batteryTemperature",
    "temperatureCorrectedVoltage",
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
      <div>
        <h1> 24 hour statistics for {this.props.match.params.nodeId} </h1>

        <aside>Latest measurement: {latestMeasurement}</aside>

        <div className="charts">{charts}</div>
      </div>
    );
  }
}
