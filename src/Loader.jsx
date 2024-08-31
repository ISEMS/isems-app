import React from "react";

import "./Loader.css";

export default function Loader({ children }) {
  return (
    <div className="loader">
      <div className="spinner">
        <div className="double-bounce1" />
        <div className="double-bounce2" />
      </div>
      <div>{children}</div>
    </div>
  );
}
