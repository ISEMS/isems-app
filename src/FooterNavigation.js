import React from "react";

import "./FooterNavigation.css"
import {NavLink} from "react-router-dom";
import {ViewList, Map} from "@material-ui/icons";

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