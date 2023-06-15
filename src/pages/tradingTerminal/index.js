import React from "react";
import { useIntl } from "react-intl";
import { Box } from "@material-ui/core";
import { Helmet } from "react-helmet";
import { TradingView } from "../../components/TradingTerminal";
import { FormattedMessage } from "react-intl";
import { Typography } from "@material-ui/core";
import "./tradingTerminal.scss";

const TradingTerminal = () => {
  const intl = useIntl();
  return (
    <Box className="tradingTerminalPage">
      {/* <Helmet>
        <title>{`${intl.formatMessage({
          id: "menu.tradingterminal",
        })} | ${intl.formatMessage({ id: "product" })}`}</title>
        <script id="tvwidget" src="https://s3.tradingview.com/tv.js" type="text/javascript" />
      </Helmet>
      <Box className="titleBox">
        <Typography variant="h1">
          <FormattedMessage id="terminal.title" />
        </Typography>
      </Box>
      <TradingView /> */}
    </Box>
  );
};

export default TradingTerminal;
