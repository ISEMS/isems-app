import React from "react";

import "./FooterNavigation.sass"
import {NavLink} from "react-router-dom";
import ViewList from "@material-ui/icons/ViewList"
import Map from "@material-ui/icons/Map"

export default function FooterNavigation() {
  return (
    <nav className="footerNavigation">
      <ul>
        <li>
          <NavLink to="/list" activeClassName="active">
            <ViewList />
            <div>
              List
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to="/map" activeClassName="active">
            <Map/>
            <div>
              Map
            </div>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}