import React, { useEffect } from "react";
import { Box, Typography, CircularProgress } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import useUpdatedBalance from "../../../hooks/useUpdatedBalance";
import useStoreUIBalanceLoader from "../../../hooks/useStoreUIBalanceLoader";
import { useDispatch } from "react-redux";
import { showBalanceLoader } from "../../../store/actions/ui";

const BalanceBox = () => {
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
          alignItems="center"
          className="balanceContainer"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Box
            alignItems="flex-start"
            className="balanceBox"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Typography className="title" variant="subtitle1">
              <FormattedMessage id="balance.available" />
            </Typography>
            <Typography variant="h5">BTC {balance.totalFreeBTC}</Typography>
            <Typography variant="subtitle2">USDT {balance.totalFreeUSDT}</Typography>
          </Box>

          <Box
            alignItems="flex-start"
            className="balanceBox"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Typography className="title" variant="subtitle1">
              <FormattedMessage id="balance.invested" />
            </Typography>
            <Typography variant="h5">BTC {balance.totalLockedBTC}</Typography>
            <Typography variant="subtitle2">USDT {balance.totalLockedUSDT}</Typography>
          </Box>

          <Box
            alignItems="flex-start"
            className="balanceBox"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Typography className="title" variant="subtitle1">
              <FormattedMessage id="balance.profitlosses" />
            </Typography>
            <Typography className={balance.pnlBTC > 0 ? "green" : "red"} variant="h5">
              BTC {balance.pnlBTC}
            </Typography>
            <Typography className={balance.pnlUSDT > 0 ? "green" : "red"} variant="subtitle2">
              USDT {balance.pnlUSDT}
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
};

export default BalanceBox;
