import React, { Fragment } from "react";
import { Box, Typography, CircularProgress } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import useStoreUserSelector from "../../../hooks/useStoreUserSelector";
import { useDispatch } from "react-redux";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import { setUserBalance } from "../../../store/actions/user";
import useInterval from "use-interval";

const BalanceBox = () => {
  const storeUser = useStoreUserSelector();
  const storeSession = useStoreSessionSelector();
  const storeSettings = useStoreSettingsSelector();
  const dispatch = useDispatch();

  const loadBalance = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      exchangeInternalId: storeSettings.selectedExchange.internalId,
    };

    dispatch(setUserBalance(payload));
  };

  useInterval(loadBalance, 5000);

  return (
    <Fragment>
      {storeUser.balance.loading && (
        <Box
          className="balanceContainer"
          alignItems="center"
          display="flex"
          flexDirection="row"
          justifyContent="center"
        >
          <CircularProgress color="primary" />
        </Box>
      )}
      {!storeUser.balance.loading && (
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
            <Typography variant="h5">BTC {storeUser.balance.totalFreeBTC}</Typography>
            <Typography variant="subtitle2">USDT {storeUser.balance.totalFreeUSDT}</Typography>
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
            <Typography variant="h5">BTC {storeUser.balance.totalLockedBTC}</Typography>
            <Typography variant="subtitle2">USDT {storeUser.balance.totalLockedUSDT}</Typography>
          </Box>

          <Box
            alignItems="flex-start"
            className="balanceBox"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Typography className="title" variant="subtitle1">
              <FormattedMessage id="col.plnumber" />
            </Typography>
            <Typography className={storeUser.balance.pnlBTC > 0 ? "green" : "red"} variant="h5">
              BTC {storeUser.balance.pnlBTC}
            </Typography>
            <Typography
              className={storeUser.balance.pnlUSDT > 0 ? "green" : "red"}
              variant="subtitle2"
            >
              USDT {storeUser.balance.pnlUSDT}
            </Typography>
          </Box>
        </Box>
      )}
    </Fragment>
  );
};

export default BalanceBox;
