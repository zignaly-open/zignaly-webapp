import React from "react";
import "./PressQuote.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";

const PressQuote = ({ quote }) => {
  return (
    <Box className="pressQuote">
      <span className="date">{quote.date.format("MMMM D, YYYY")}</span>
      <span className="quoteIcon">“</span>
      <div className="content">{quote.quote}</div>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        className="quoteFooter"
        alignItems="center"
        width={1}
      >
        <Typography className="readMore">
          <FormattedMessage id="login.readmore" />
        </Typography>
        <img src={quote.logo} />
      </Box>
    </Box>
  );
};

export default PressQuote;
