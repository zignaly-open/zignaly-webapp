import React from "react";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage, useIntl } from "react-intl";
import { SubNavModalHeader } from "../../../SubNavHeader";
import "./BalanceManagement.scss";

const BalanceManagement = ({ children }) => {
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
    <Box className="balanceManagement">
      <SubNavModalHeader links={tabs} />
      {children}
    </Box>
  );
};

export default BalanceManagement;
