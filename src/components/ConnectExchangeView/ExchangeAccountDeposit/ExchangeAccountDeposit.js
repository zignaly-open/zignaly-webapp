import React, { useEffect, useContext } from "react";
import { FormattedMessage } from "react-intl";
import ModalPathContext from "../ModalPathContext";
import { Box, Typography } from "@material-ui/core";
import { SubNavModalHeader } from "../../SubNavHeader";
import "./ExchangeAccountDeposit.scss";

const ExchangeAccountDeposit = () => {
  const {
    pathParams: { selectedAccount, previousPath },
    setTitle,
    formRef,
    setTempMessage,
    setPathParams,
  } = useContext(ModalPathContext);

  useEffect(() => {
    setTitle(selectedAccount.internalName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabs = [
    {
      id: "deposit",
      title: "accounts.deposit",
    },
    {
      id: "withdraw",
      title: "accounts.withdraw",
    },
  ];

  return (
    <Box className="exchangeAccountDeposit">
      <SubNavModalHeader links={tabs} />
    </Box>
  );
};

export default ExchangeAccountDeposit;
