import React, { useEffect, useContext } from "react";
import "./ExchangeOrders.scss";
import ModalPathContext from "../ModalPathContext";
import { Box, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import ExchangeIcon from "../../ExchangeIcon";
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
      alignItems="flex-start"
      className="exchangeOrders"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
    >
      <OrdersTabs />
    </Box>
  );
};

export default ExchangeOrders;
