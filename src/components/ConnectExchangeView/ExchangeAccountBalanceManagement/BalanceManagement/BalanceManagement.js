import React from "react";
import { Box } from "@material-ui/core";
import { SubNavModalHeader } from "../../../SubNavHeader";
import "./BalanceManagement.scss";

/**
 * @typedef {Object} BalanceManagementPropTypes
 * @property {React.ReactElement} children Children elements
 */

/**
 * Provides a tip box.
 *
 * @param {BalanceManagementPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
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
