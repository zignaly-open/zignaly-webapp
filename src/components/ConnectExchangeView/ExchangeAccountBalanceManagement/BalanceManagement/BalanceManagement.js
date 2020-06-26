import React, { useContext, useEffect } from "react";
import { Box } from "@material-ui/core";
import { SubNavModalHeader } from "../../../SubNavHeader";
import "./BalanceManagement.scss";
import ModalPathContext from "../../ModalPathContext";

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
  const {
    pathParams: { selectedAccount },
    setTitle,
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
  if (selectedAccount.isBrokerAccount) {
    tabs.push({
      id: "convert",
      title: "accounts.convert",
    });
  }

  return (
    <Box className="balanceManagement">
      <SubNavModalHeader links={tabs} />
      {children}
    </Box>
  );
};

export default BalanceManagement;
