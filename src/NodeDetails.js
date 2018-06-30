import { Component } from "react";
import React from "react";
import {Check, Warning, Error} from "@material-ui/icons"
import {groupBy} from "lodash"

import "./NodeDetails.css"
import {Link} from "react-router-dom";
import {checkAll} from "./checks";
import {fetchDetails} from "./api";

function getIcon(type){
  const mapping = {
    "error": <Error />,
    "warning": <Warning />,
    "info": <Check/>
  };
  return mapping[type];
}

export function Message({status}){
  const icon = getIcon(status.type);
  return <li> {icon} <span>{status.message}</span> </li>
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
    const messages = this.state.measurements && checkAll(this.state.measurements[0]);
    const types = {info: [], warning: [], error: []};

    const groups = groupBy(messages, "type");
    const displayMessages = {...types, ...groups};

    return (
      <div className="node-details">
        <h1> {this.props.match.params.nodeId} </h1>

        <ul className="status errors">
          {displayMessages.error.map(status => <Message key={status.name} status={status} />)}
        </ul>
        <ul className="status warnings">
          {displayMessages.warning.map(status => <Message key={status.name} status={status} />)}
        </ul>
        <ul className="status infos">
          {displayMessages.info.map(status => <Message key={status.name} status={status} />)}
        </ul>
        <Link to={`/details/${this.props.match.params.nodeId}/charts`}>Show charts</Link>

      </div>
    );
  }
}
