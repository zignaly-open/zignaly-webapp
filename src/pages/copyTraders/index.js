import React from "react";
import { Router } from "@reach/router";
import Profile from "./profile";

// /**
//  * @typedef {Object} PositionPageProps
//  * @property {string} traderId The position ID dynamic route path parameter.
//  */

// /**
//  * Position detail page component.
//  *
//  * @param {PositionPageProps} props Component properties.
//  * @returns {JSX.Element} Position page element.
//  */

const CopyTraders = () => {
  return (
    <Router>
      <Profile path="/copyTraders/:traderId/profile" />
    </Router>
  );
};

export default CopyTraders;
