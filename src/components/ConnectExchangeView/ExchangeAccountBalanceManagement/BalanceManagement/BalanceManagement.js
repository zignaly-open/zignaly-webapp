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
  const { pathParams, setTitle, setPathParams } = useContext(ModalPathContext);

  useEffect(() => {
    setTitle(pathParams.selectedAccount.internalName);
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
    {
      id: "transfer",
      title: "accounts.transfer",
    },
    {
      id: "convert",
      title: "accounts.convert",
    },
  ];

  /**
   * Navigation callback
   * @param {string} id tab id
   * @returns {void}
   */
  const handleTabChange = (id) => {
    // Only update current path while keeping previous path
    setPathParams({
      ...pathParams,
      currentPath: id,
    });
  };

  return (
    <Box className="balanceManagement">
      <SubNavModalHeader
        currentPath={pathParams.currentPath}
        links={tabs}
        onClick={handleTabChange}
      />
      {children}
    </Box>
  );
};

export default BalanceManagement;
