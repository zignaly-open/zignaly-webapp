import React from "react";
import { Box } from "@material-ui/core";

/**
 * @typedef {Object} DefaultProps
 * @property {string} internalId Internal Exchange id.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ExchangeAccountSettings = ({ internalId }) => {
  return <Box>{internalId}</Box>;
};

export default ExchangeAccountSettings;
