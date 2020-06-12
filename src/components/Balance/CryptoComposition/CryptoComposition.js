import React from "react";
import "./CryptoComposition.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import CompositionGraph from "./CompositionGraph";

const CryptoComposition = ({ balances, quotes }) => {
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
      <CompositionGraph list={balances} quotes={quotes} />
    </Box>
  );
};

export default CryptoComposition;
