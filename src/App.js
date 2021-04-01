import React, {Component} from "react";
import {Redirect, Route, Switch} from "react-router-dom";

import NodeCharts from "./NodeCharts";
import NodeList from "./NodeList";
import NodeMap from "./Map";
import FooterNavigation from "./FooterNavigation";
import {fetchData} from "./api";
import "./App.sass";
import NodeDetails from "./NodeDetails";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: [],
      loadError: false,
      showsInactiveNodes: false,
    };
    this.setData = this.setData.bind(this);
    this.showInactiveNodes = this.showInactiveNodes.bind(this);
  }

  setData(nodes) {
    this.setState({ nodes });
  }

  loadNodes(loadAll) {
    fetchData(loadAll)
        .then(this.setData)
        .catch(() => {
          this.setState({loadError: true});
        });
  }

  showInactiveNodes() {
    this.loadNodes(true);
    this.setState({showsInactiveNodes: true})
  }

  componentDidMount() {
    this.loadNodes(false)
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>ISEMS Management</h1>
        </header>
        <Switch>
          <Route exact path="/">
            <Redirect to="/list" />
          </Route>
          <Route path="/map">
            <NodeMap nodes={this.state.nodes} />
          </Route>
          <Route path="/list">
            <NodeList nodes={this.state.nodes}
                      error={this.state.loadError}
                      onLoadAllNodes={this.showInactiveNodes}
                      showsInactiveNodes={this.state.showsInactiveNodes}
            />
          </Route>
          <Route exact path="/details/:nodeId" component={NodeDetails} />
          <Route path="/details/:nodeId/charts" component={NodeCharts} />
        </Switch>
        <FooterNavigation />
      </div>
    );
  }
}

export default App;
