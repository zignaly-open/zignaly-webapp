import React from "react";
import { Router } from "@reach/router";
import Profile from "./profile";

/**
 *
 * @typedef {Object} LocationObject
 * @property {String} pathname
 */

/**
 * @typedef {Object} PositionPageProps
 * @property {String} providerId
 * @property {LocationObject} location position ID dynamic route path parameter.
 */

/**
 * Position detail page component.
 *
 * @param {PositionPageProps} props Component properties.
 * @returns {JSX.Element} Position page element.
 */

const CopyTraders = (props) => {
  return (
    <Router>
      <Profile path="/copyTraders/:providerId/profile" />
    </Router>
  );
};

export default CopyTraders;
