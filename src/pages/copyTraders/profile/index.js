import React from "react";
import { Box } from "@material-ui/core";

/**
 * @typedef {Object} PositionPageProps
 * @property {String} path
 */

/**
 * Position detail page component.
 *
 * @param {PositionPageProps} props Component properties.
 * @returns {JSX.Element} Position page element.
 */

const CopyTradersProfile = (props) => {
  return <Box>dynamic route for {props.path}</Box>;
};

export default CopyTradersProfile;
