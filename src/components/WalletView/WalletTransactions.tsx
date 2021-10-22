import React, { useEffect, useState } from "react";
import tradeApi from "services/tradeApiClient";
import { Panel, SubTitle, Title } from "styles/styles";
import { Box } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import WalletIcon from "images/wallet/wallet.svg";

const WalletTransactions = () => {
  const [transactions, setTransactions] = useState();

  useEffect(() => {
    tradeApi.getWalletTransactionsHistory().then((response) => {
      setTransactions(response);
      // console.log(response);
    });
  }, []);

  return (
    <Title>
      <Box alignItems="center" display="flex">
        <img height="30px" src={WalletIcon} width="33px" />
        <FormattedMessage id="wallet.transactions" />
      </Box>
    </Title>
  );
};

export default WalletTransactions;
