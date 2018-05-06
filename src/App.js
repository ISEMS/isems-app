import React, { Component } from "react";
import "./App.css";
import { parseData } from "./parser";
import "leaflet/dist/leaflet.css";
import NodeMap from "./Map";

import Notifications from "./Notifications";

const fetchData = () => {
  const backendUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/measurements/latest";
  return fetch(backendUrl)
    .then(response => response.json())
    .then(json => json.measurements);
};

const fakefetchData = () => {
  const fakeData =
    "Elektra-Solar1;1;1522935107;5;480;0;22.0;18.0;13.9;95;100;23;11.7;14.1;17;50;52.507454;13.458673\n";
  return Promise.resolve(parseData(fakeData));
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: []
    };
    this.setData = this.setData.bind(this);
  }

  setData(parsedData) {
    const nodes = parsedData.map(node => {
      return {
        position: [node.latitude, node.longitude],
        name: node.nodeId,
        timestamp: new Date(node.timestamp),
        batteryChargeEstimate: node.batteryChargeEstimate
      };
    });
    this.setState({ nodes });
  }

  componentDidMount() {
    fetchData()
      .then(this.setData)
      .catch(() => {
        Notifications.info("Cannot load data, using example data");
        return fakefetchData().then(this.setData);
      });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">ISEMS Management</h1>
        </header>
        <NodeMap nodes={this.state.nodes} />
      </div>
    );
  }
}

export default App;
