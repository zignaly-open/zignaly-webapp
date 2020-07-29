import React, { useContext } from "react";
import ExchangeAccountList from "../ExchangeAccountList";
import ExchangeAccountSettings from "../ExchangeAccountSettings";
import Deposit from "../ExchangeAccountBalanceManagement/Deposit";
import Withdraw from "../ExchangeAccountBalanceManagement/Withdraw";
import Convert from "../ExchangeAccountBalanceManagement/Convert";
import ExchangeAccountConnect from "../ExchangeAccountConnect";
import ExchangeAccountAdd from "../ExchangeAccountAdd";
import ModalPathContext from "../ModalPathContext";
import ExchangeOrders from "../ExchangeOrders";

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
      return <ExchangeAccountAdd create={true} demo={path === "createDemoAccount"} />;
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
