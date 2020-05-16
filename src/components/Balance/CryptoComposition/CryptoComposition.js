import React from "react";
import "./CryptoComposition.scss";
import { Box, Typography } from "@material-ui/core";
import Doughnut from "../../Graphs/Doughnut";
import { FormattedMessage } from "react-intl";

const CryptoComposition = (props) => {
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
      <Doughnut />
    </Box>
  );
};

export default CryptoComposition;
