import React from "react";
import { Box } from "@material-ui/core";

/**
 * @typedef {Object} CopyTradersProfilePageProps
 * @property {String} path
 */

/**
 * Position detail page component.
 *
 * @param {CopyTradersProfilePageProps} props Component properties.
 * @returns {JSX.Element} Position page element.
 */

const CopyTradersProfile = (props) => {
  return <Box>dynamic route for {props.path}</Box>;
};

export default CopyTradersProfile;
