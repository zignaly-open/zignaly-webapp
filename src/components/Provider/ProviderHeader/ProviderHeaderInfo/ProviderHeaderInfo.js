import React, { useState } from "react";
import "./ProviderHeaderInfo.scss";
import { Box, Typography } from "@material-ui/core";
import useStoreViewsSelector from "../../../../hooks/useStoreViewsSelector";
import { FormattedMessage } from "react-intl";
import ExchangeIcon from "../../../ExchangeIcon";

/**
 * Provides the navigation bar for the dashboard.
 *
 * @returns {JSX.Element} Component JSX.
 */
const ProviderHeaderInfo = () => {
  const storeViews = useStoreViewsSelector();

  return (
    <Box
      alignItems="center"
      className="providerHeaderInfo"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
    >
      <Typography variant="h4">
        <FormattedMessage id="srv.basecurrency" />
        <b> {storeViews.provider.copyTradingQuote} </b>
      </Typography>
      <Typography variant="h4">
        <FormattedMessage id="copyt.trading" />
        <Box className="imageBox">
          {storeViews.provider.exchanges.map((item, index) => (
            <ExchangeIcon exchange={item} key={index} size="small" />
          ))}
        </Box>
      </Typography>
      <Typography variant="h4">
        <FormattedMessage id="copyt.copiers" />
        <b> {storeViews.provider.copyTradingQuote} </b>
      </Typography>
      <Typography variant="h4">
        <FormattedMessage id="copyt.fee" />
        <b>
          {storeViews.provider.fee.toLowerCase() === "free" ? (
            <FormattedMessage id="col.free" />
          ) : (
            storeViews.provider.fee
          )}
        </b>
      </Typography>
      <Typography variant="h4">
        <FormattedMessage id="srv.minimum" />
        <b>
          {storeViews.provider.minAllocatedBalance} {storeViews.provider.copyTradingQuote}
        </b>
      </Typography>
    </Box>
  );
};

export default ProviderHeaderInfo;
