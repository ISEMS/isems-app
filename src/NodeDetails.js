import { Component } from "react";
import React from "react";
import { Check, Warning, Error } from "@material-ui/icons";
import { groupBy } from "lodash";

import "./NodeDetails.css";
import { Link } from "react-router-dom";
import { checkAll } from "./checks";
import { fetchDetails } from "./api";

function getIcon(type) {
  const mapping = {
    error: <Error />,
    warning: <Warning />,
    info: <Check />
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

export function MessageList({ messages, type }) {
  return (
    <ul className={`status ${type}`}>
      {messages.map(status => <Message key={status.name} status={status} />)}
    </ul>
  );
}

export function MessageGroups({ displayMessages }) {
  return (
    <React.Fragment>
      <MessageList messages={displayMessages.error} type="errors" />
      <MessageList messages={displayMessages.warning} type="warnings" />
      <MessageList messages={displayMessages.info} type="infos" />
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
    const types = { info: [], warning: [], error: [] };

    const groups = groupBy(messages, "type");
    const displayMessages = { ...types, ...groups };

    return (
      <div className="node-details">
        <h1> {this.props.match.params.nodeId} </h1>

        <MessageGroups displayMessages={displayMessages} />

        <Link to={`/details/${this.props.match.params.nodeId}/charts`}>
          Show charts
        </Link>
      </div>
    );
  }
}
