import React from "react";
import "./NoExchanges.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import ExchangeIcon from "../../ExchangeIcon";
import { navigate as navigateReach } from "@reach/router";
import useExchangeList from "../../../hooks/useExchangeList";
import { getExchangeNamesCombined } from "../../../utils/helpers";

const NoExchanges = () => {
  const { exchanges } = useExchangeList();

  const handleClickEvent = () => {
    navigateReach("#exchangeAccounts");
  };

  return (
    <Box
      className="noExchangeBox"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      <Typography variant="h1">
        <FormattedMessage id="dashboard" />
      </Typography>
      <span className="title">
        <FormattedMessage id="dashboard.connectexchange.preText" />
        <b onClick={handleClickEvent}>
          <FormattedMessage id="dashboard.connectexchange.bold.title" />
        </b>
        <FormattedMessage id="dashboard.connectexchange.postText" />
      </span>
      <span className="subtitle">
        <FormattedMessage id="dashboard.connectexchange.subtitle" />
        <br />
        <span>{getExchangeNamesCombined(exchanges, "or")}</span>
      </span>
      <Box display="flex" flexDirection="row" justifyContent="flex-start">
        {exchanges &&
          exchanges.map(
            (item, index) =>
              item.enabled &&
              item.name.toLowerCase() !== "zignaly" && (
                <ExchangeIcon exchange={item.name.toLowerCase()} key={index} size="xlarge" />
              ),
          )}
      </Box>
    </Box>
  );
};

export default NoExchanges;
