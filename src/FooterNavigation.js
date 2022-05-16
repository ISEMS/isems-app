import React from "react";

import "./FooterNavigation.sass"
import {NavLink} from "react-router-dom";
import ViewList from "@material-ui/icons/ViewList"
import Map from "@material-ui/icons/Map"
import {useTranslation} from "react-i18next";

export default function FooterNavigation() {
  const {t} = useTranslation();

  return (
    <nav className="footerNavigation">
      <ul>
        <li>
          <NavLink to="/list" activeClassName="active">
            <ViewList />
            <div>
              {t('navigation.list')}
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to="/map" activeClassName="active">
            <Map/>
            <div>
              {t('navigation.map')}
            </div>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
