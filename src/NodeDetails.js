import { Component } from "react";
import React from "react";
import Check from "@material-ui/icons/Check"
import Warning from "@material-ui/icons/Warning"
import Error from "@material-ui/icons/Error"

import { groupBy, remove } from "lodash";

import "./NodeDetails.css";
import { Link } from "react-router-dom";
import { checkAll } from "./checks";
import { fetchDetails } from "./api";
import Loader from "./Loader";

function getIcon(type) {
  const mapping = {
    critical: <Error style={{ fill: "#FF4136" }} />,
    error: <Error style={{ fill: "#FF4136" }} />,
    warning: <Warning style={{ fill: "#ff8115" }} />,
    info: <Check style={{ fill: "green" }} />
  };
  return mapping[type];
}

export function Message({ status }) {
  const icon = getIcon(status.type);
  return (
    <li>
      {icon} <span>{status.message}</span>
    </li>
  );
}

export function MessageList({ messages }) {
  return (
    <ul className="status">
      {messages.map(status => <Message key={status.name} status={status} />)}
    </ul>
  );
}

export function MessageGroups({ displayMessages }) {
  const timeMessages = remove(
    displayMessages.info,
    message => message.name === "timeOffset"
  );

  if (displayMessages.critical.length) {
    return (
      <React.Fragment>
        {timeMessages && <MessageList messages={timeMessages} />}
        <MessageList messages={displayMessages.critical} />

        <div className="critical-explanation">
          This message is considered critical. <br />
          Due to this we can not reliably show you any other information about
          this node.
        </div>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      {timeMessages && <MessageList messages={timeMessages} />}

      <MessageList messages={displayMessages.error} />
      <MessageList messages={displayMessages.warning} />
      <MessageList messages={displayMessages.info} />
    </React.Fragment>
  );
}

export default class NodeDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      measurements: null
    };
  }

  componentDidMount() {
    return fetchDetails(this.props.match.params.nodeId).then(measurements =>
      this.setState({ measurements })
    );
  }

  render() {
    const messages =
      this.state.measurements && checkAll(this.state.measurements[0]);
    const types = { info: [], warning: [], error: [], critical: [] };

    const groups = groupBy(messages, "type");
    const displayMessages = { ...types, ...groups };

    return (
      <div className="node-details">
        <h1> {this.props.match.params.nodeId} </h1>

        {this.state.measurements ? (
          <div>
            <MessageGroups displayMessages={displayMessages} />
          </div>
        ) : (
          <Loader>
            <div style={{ textAlign: "center" }}>Loading...</div>
          </Loader>
        )}

        <Link to={`/details/${this.props.match.params.nodeId}/charts`}>
          Show charts
        </Link>
      </div>
    );
  }
}
