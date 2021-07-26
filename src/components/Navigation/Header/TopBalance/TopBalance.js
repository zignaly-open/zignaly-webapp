import React, { useEffect } from "react";
import { Box, CircularProgress } from "@material-ui/core";
import useUpdatedBalance from "../../../../hooks/useUpdatedBalance";
import useStoreUIBalanceLoader from "../../../../hooks/useStoreUIBalanceLoader";
import { useDispatch } from "react-redux";
import { showBalanceLoader } from "../../../../store/actions/ui";
import useSelectedExchange from "hooks/useSelectedExchange";
import SpotBalance from "./SpotBalance";
import FuturesBalance from "./FuturesBalance";

const TopBalance = () => {
  const selectedExchange = useSelectedExchange();
  const balance = useUpdatedBalance();
  const storeBalanceLoader = useStoreUIBalanceLoader();
  const dispatch = useDispatch();

  const showLoader = () => {
    dispatch(showBalanceLoader(true));
  };

  useEffect(showLoader, []);

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
