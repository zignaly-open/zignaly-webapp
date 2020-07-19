import React, { useState, useEffect, useContext } from "react";
import "./ExchangeOrders.scss";
import ModalPathContext from "../ModalPathContext";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import ExchangeIcon from "../../ExchangeIcon";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../../../store/actions/ui";
import OrdersTabs from "./OrdersTabs";

const ExchangeOrders = () => {
  const {
    pathParams: { selectedAccount },
    setTitle,
  } = useContext(ModalPathContext);

  useEffect(() => {
    setTitle(
      <Box alignItems="center" display="flex" flexDirection="row">
        <FormattedMessage id="accounts.orders" />
        <span className="separator">-</span>
        <ExchangeIcon exchange={selectedAccount.name.toLowerCase()} size="xlarge" />
        <Typography variant="h3">{selectedAccount.internalName}</Typography>
      </Box>,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      className="exchangeOrders"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      <OrdersTabs />
    </Box>
  );
};

export default ExchangeOrders;
