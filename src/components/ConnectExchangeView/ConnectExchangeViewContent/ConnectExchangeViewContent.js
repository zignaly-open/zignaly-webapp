import React, { useContext } from "react";
import ExchangeAccountList from "../ExchangeAccountList";
import ExchangeAccountSettings from "../ExchangeAccountSettings";
import ExchangeAccountDeposit from "../ExchangeAccountBalanceManagement/Deposit";
import ExchangeAccountWithdraw from "../ExchangeAccountBalanceManagement/Withdraw";
import ExchangeAccountAdd from "../ExchangeAccountAdd";
import ModalPathContext from "../ModalPathContext";

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
    case "connectDemoAccount":
      return <ExchangeAccountAdd create={false} demo={path === "connectDemoAccount"} />;
    case "settings":
      return <ExchangeAccountSettings />;
    case "deposit":
      return <ExchangeAccountDeposit />;
    case "withdraw":
      return <ExchangeAccountWithdraw />;
  }
};

export default ConnectExchangeViewContent;
