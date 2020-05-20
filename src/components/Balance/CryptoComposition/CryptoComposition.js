import React from "react";
import "./CryptoComposition.scss";
import { Box, Typography } from "@material-ui/core";
import Doughnut from "../../Graphs/Doughnut";
import { FormattedMessage } from "react-intl";

// /**
//  * @typedef {Object} CryptoCompositionProps
//  * @property {Object} crypto Object which will contain the user's available crypto and will
//  */

// /**
//  * User's crypto composition and all available crypto balance.
//  *
//  * @param {CryptoCompositionProps} props Component properties.
//  */

const CryptoComposition = () => {
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
