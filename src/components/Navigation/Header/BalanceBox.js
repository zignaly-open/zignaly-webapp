import React from "react";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";

/**
 * @typedef {import('../../../store/initialState').DefaultState} DefaultState
 * @typedef {import('../../../store/initialState').UserBalanceEntity} UserBalanceEntity
 */

const BalanceBox = () => {
  /**
   * User balance selector.
   *
   * @param {DefaultState} state Redux store state data.
   * @return {UserBalanceEntity} Object that contains user balance properties.
   */
  const userBalanceSelector = (state) => state.user.balance;
  const balance = useSelector(userBalanceSelector);

  return (
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
        <Typography className="balance" variant="h5">
          {balance.totalOpen}
        </Typography>
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
        <Typography className="balance" variant="h5">
          {balance.totalInvested}
        </Typography>
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
        <Typography
          className={"balance " + (parseFloat(balance.totalProfit) > 0 ? "green" : "red")}
          variant="h5"
        >
          {balance.totalProfit}
        </Typography>
      </Box>
    </Box>
  );
};

export default BalanceBox;
