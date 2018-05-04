import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { parseData } from "./parser";
import "leaflet/dist/leaflet.css";
import NodeMap from "./Map";

const fetchData = () => {
  return fetch("http://10.230.77.226/api/ISEMS/ffopenmppt.log").then(response =>
    response.text()
  );
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: []
    };
  }

  componentDidMount() {
    fetchData().then(data => {
      const parsedData = parseData(data);
      this.setState({
        nodes: [
          {
            position: [parsedData[0].latitude, parsedData[0].longitude],
            name: parsedData[0].nodeId
          }
        ]
      });
    });
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
