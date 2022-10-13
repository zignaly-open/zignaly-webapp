import React from "react";
import "./PressQuote.scss";
import { Box } from "@material-ui/core";
import { FormattedMessage } from "react-intl";

/**
 * @typedef {import("dayjs").Dayjs} Dayjs
 */

/**
 * @typedef {Object} Quote
 * @property {Dayjs} date Date
 * @property {string} quote Quote
 * @property {string} url Url
 * @property {string} logo Logo
 */

/**
 * Provides a body for a trader card.
 *
 * @param {{quote: Quote}} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const PressQuote = ({ quote }) => {
  return (
    <Box className="pressQuote">
      <img src={quote.logo} />
    </Box>
  );
};

export default PressQuote;
