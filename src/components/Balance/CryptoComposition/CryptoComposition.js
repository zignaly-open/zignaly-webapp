import React from "react";
import "./CryptoComposition.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import CompositionGraph from "./CompositionGraph";
import useStoreUserSelector from "../../../hooks/useStoreUserSelector";

const CryptoComposition = () => {
  const storeUser = useStoreUserSelector();

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
      <CompositionGraph list={storeUser.dailyBalance} />
    </Box>
  );
};

export default CryptoComposition;
