import React, { useContext, useEffect } from "react";
import ExchangeAccountList from "../ExchangeAccountList";
import ExchangeAccountSettings from "../ExchangeAccountSettings";
import Deposit from "../ExchangeAccountBalanceManagement/Deposit";
import Withdraw from "../ExchangeAccountBalanceManagement/Withdraw";
import ExchangeAccountConnect from "../ExchangeAccountConnect";
import ExchangeAccountAdd from "../ExchangeAccountAdd";
import ModalPathContext from "../ModalPathContext";
import ExchangeOrders from "../ExchangeOrders";
import Convert from "../ExchangeAccountBalanceManagement/Convert";
import Transfer from "../ExchangeAccountBalanceManagement/Transfer";
import { getURLPath } from "hooks/useModalPath";

/**
 * @typedef {Object} DefaultProps
 * @property {string} searchFilter Search filter
 */

/**
 * Render the content the account exchanges modal depending on the current path.
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} Component JSX.
 */
const ConnectExchangeViewContent = ({ searchFilter = "" }) => {
  const {
    pathParams: { selectedAccount },
    resetToPath,
  } = useContext(ModalPathContext);
  const currentPath = getURLPath();
  console.log("currentPath", currentPath);

  let canProceed = false;
  if (["deposit", "withdraw", "convert"].includes(currentPath)) {
    if (selectedAccount?.isBrokerAccount) {
      canProceed = true;
    }
  } else if (currentPath === "convert" && selectedAccount?.exchangeType.toLowerCase() === "spot") {
    canProceed = true;
  } else if (["settings"].includes(currentPath) && selectedAccount) {
    canProceed = true;
  } else {
    // Default root path
    canProceed = true;
  }

  useEffect(() => {
    if (selectedAccount && !canProceed) {
      resetToPath();
    }
  }, [selectedAccount]);

  if (!canProceed) {
    return null;
  }

  switch (currentPath) {
    case "realAccounts":
    case "demoAccounts":
    default:
      return (
        <ExchangeAccountList demo={currentPath === "demoAccounts"} searchFilter={searchFilter} />
      );
    case "createAccount":
    case "createDemoAccount":
      return <ExchangeAccountAdd demo={currentPath === "createDemoAccount"} />;
    case "connectAccount":
      return <ExchangeAccountConnect />;
    case "settings":
      return <ExchangeAccountSettings />;
    case "deposit":
      return <Deposit />;
    case "transfer":
      return <Transfer />;
    case "withdraw":
      return <Withdraw />;
    case "convert":
      return <Convert />;
    case "orders":
      return <ExchangeOrders />;
  }
};

export default ConnectExchangeViewContent;
