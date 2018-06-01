import React, {Component} from "react";
import "./App.css";
import {parseData} from "./parser";
import "leaflet/dist/leaflet.css";

import Notifications from "./Notifications";
import {Route, Switch} from "react-router-dom";
import NodeDetails from "./NodeDetails";
import NodeList from "./NodeList";
import NodeMap from "./Map";
import FooterNavigation from "./FooterNavigation";

const fetchData = () => {
  const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const url = `${baseUrl}/measurements/latest`;
  return fetch(url)
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

  setData(nodes) {
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
          <h1>ISEMS Management</h1>
        </header>
        <Switch>
          <Route path="/map">
            <NodeMap nodes={this.state.nodes} />
          </Route>
          <Route path="/list">
            <NodeList nodes={this.state.nodes} />
          </Route>
          <Route path="/details/:nodeId" component={NodeDetails} />
        </Switch>
        <FooterNavigation />
      </div>
    );
  }
}

export default App;
