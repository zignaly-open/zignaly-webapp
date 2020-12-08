import React, { useContext } from "react";
import ExchangeAccountList from "../ExchangeAccountList";
import ExchangeAccountSettings from "../ExchangeAccountSettings";
import Deposit from "../ExchangeAccountBalanceManagement/Deposit";
import Withdraw from "../ExchangeAccountBalanceManagement/Withdraw";
import ExchangeAccountConnect from "../ExchangeAccountConnect";
import ExchangeAccountAdd from "../ExchangeAccountAdd";
import ModalPathContext from "../ModalPathContext";
import ExchangeOrders from "../ExchangeOrders";
import Convert from "../ExchangeAccountBalanceManagement/Convert";

/**
 * Render the content the account exchanges modal depending on the current path.
 * @returns {JSX.Element} Component JSX.
 */
const ConnectExchangeViewContent = () => {
  const { pathParams } = useContext(ModalPathContext);

  const path = pathParams.currentPath;
  switch (path) {
    case "realAccounts":
    case "demoAccounts":
    default:
      return <ExchangeAccountList demo={path === "demoAccounts"} />;
    case "createAccount":
    case "createDemoAccount":
      return <ExchangeAccountAdd demo={path === "createDemoAccount"} />;
    case "connectAccount":
      return <ExchangeAccountConnect />;
    case "settings":
      return <ExchangeAccountSettings />;
    case "deposit":
      return <Deposit />;
    case "withdraw":
      return <Withdraw />;
    case "convert":
      return <Convert />;
    case "orders":
      return <ExchangeOrders />;
  }
};

export default ConnectExchangeViewContent;
