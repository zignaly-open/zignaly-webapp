import React, { useContext } from "react";
import { Box, CircularProgress } from "@material-ui/core";
import useStoreUIBalanceLoader from "../../../../hooks/useStoreUIBalanceLoader";
import useSelectedExchange from "hooks/useSelectedExchange";
import SpotBalance from "./SpotBalance";
import FuturesBalance from "./FuturesBalance";
import PrivateAreaContext from "context/PrivateAreaContext";

const TopBalance = () => {
  const selectedExchange = useSelectedExchange();
  const storeBalanceLoader = useStoreUIBalanceLoader();
  const { balance } = useContext(PrivateAreaContext);

  return (
    <>
      {storeBalanceLoader && (
        <Box
          alignItems="center"
          className="balanceContainer"
          display="flex"
          flexDirection="row"
          justifyContent="center"
        >
          <CircularProgress color="primary" size={30} />
        </Box>
      )}
      {!storeBalanceLoader && (
        <Box
          alignItems="flex-start"
          className="balanceContainer"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          {selectedExchange.exchangeType === "futures" ? (
            <FuturesBalance balance={balance} selectedExchange={selectedExchange} />
          ) : (
            <SpotBalance balance={balance} selectedExchange={selectedExchange} />
          )}
        </Box>
      )}
    </>
  );
};

export default TopBalance;
