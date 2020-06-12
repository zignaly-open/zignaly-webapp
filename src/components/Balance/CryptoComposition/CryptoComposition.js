import React from "react";
import "./CryptoComposition.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import CompositionGraph from "./CompositionGraph";

const CryptoComposition = ({ dailyBalance }) => {
  return (
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
      <CompositionGraph list={dailyBalance.balances} quotes={dailyBalance.quotes} />
    </Box>
  );
};

export default CryptoComposition;
