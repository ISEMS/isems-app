import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { parseData } from "./parser";
import "leaflet/dist/leaflet.css";
import NodeMap from "./Map";

import Notifications from "./Notifications";

const fetchData = () => {
  return fetch("http://10.230.77.226/api/ISEMS/ffopenmppt.log").then(response =>
    response.text()
  );
};

const fakefetchData = () => {
  const fakeData = "Elektra-Solar1;1;1522935107;5;480;0;22.0;18.0;13.9;95;100;23;11.7;14.1;17;50;52.507454;13.458673\n";
  return Promise.resolve(fakeData);
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: []
    };
    this.setData = this.setData.bind(this);
  }

  setData(data) {
    const parsedData = parseData(data);
    const newestMeasurement = parsedData[parsedData.length - 1 ];
    this.setState({
      nodes: [
        {
          position: [newestMeasurement.latitude, newestMeasurement.longitude],
          name: newestMeasurement.nodeId,
          timestamp: newestMeasurement.timestamp,
          batteryChargeEstimate: newestMeasurement.batteryChargeEstimate
        }
      ]
    });
  }

  componentDidMount() {
    fetchData().then(this.setData).catch(() => {
      Notifications.info("Cannot load data, using example data");
      return fakefetchData().then(this.setData);
    })
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">ISEMS Management</h1>
        </header>
        <NodeMap nodes={this.state.nodes}/>
      </div>
    );
  }
}

export default App;
