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
    <Box className="pressQuoteOld">
      <span className="date">{quote.date.format("MMMM D, YYYY")}</span>
      <span className="quoteIcon">“</span>
      <div className="content">{quote.quote}</div>
      <Box
        alignItems="center"
        className="quoteFooter"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        width={1}
      >
        <a className="readMore" href={quote.url} rel="noreferrer" target="_blank">
          <FormattedMessage id="login.readmore" />
        </a>
        <img src={quote.logo} />
      </Box>
    </Box>
  );
};

export default PressQuote;
