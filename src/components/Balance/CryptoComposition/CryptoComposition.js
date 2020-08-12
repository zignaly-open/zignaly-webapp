import React from "react";
import "./CryptoComposition.scss";
import { Box, Typography, CircularProgress } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import CompositionGraph from "./CompositionGraph";

/**
 * @typedef {import("../../../services/tradeApiClient.types").DefaultDailyBalanceEntity} DefaultDailyBalanceEntity
 * @typedef {Object} DefaultProps
 * @property {DefaultDailyBalanceEntity} dailyBalance Daily balance.
 * @property {boolean} [vertical] Display legend under the doughnut.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const CryptoComposition = ({ dailyBalance, vertical }) => {
  return (
    <>
      {dailyBalance.loading && (
        <Box
          alignItems="center"
          className="loadingBox"
          display="flex"
          flexDirection="row"
          justifyContent="center"
        >
          <CircularProgress color="primary" size={40} />
        </Box>
      )}
      {!dailyBalance.loading && (
        <Box
          alignItems="flex-start"
          className="cryptoComposition"
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
        >
          <Typography className="boxTitle" variant="h3">
            <FormattedMessage id="dashboard.balance.cryptocompo" />
          </Typography>
          <CompositionGraph
            list={dailyBalance.balances}
            quotes={dailyBalance.quotes}
            vertical={vertical}
          />
        </Box>
      )}
    </>
  );
};

export default CryptoComposition;
