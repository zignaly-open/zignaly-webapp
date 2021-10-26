import React, { useEffect, useState } from "react";
import tradeApi from "services/tradeApiClient";
import { Panel, SubTitle, Title } from "styles/styles";
import { Box } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import ListIcon from "images/wallet/list.svg";

const WalletTransactions = () => {
  const [transactions, setTransactions] = useState();

  useEffect(() => {
    tradeApi.getWalletTransactionsHistory().then((response) => {
      setTransactions(response);
      // console.log(response);
    });
  }, []);

  return (
    
  );
};

export default WalletTransactions;
