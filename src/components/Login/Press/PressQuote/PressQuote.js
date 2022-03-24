import React from "react";
import { Box } from "@mui/material";
import { FormattedMessage } from "react-intl";
import Image from "next/image";

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
        <Image src={quote.logo} />
      </Box>
    </Box>
  );
};

export default PressQuote;
