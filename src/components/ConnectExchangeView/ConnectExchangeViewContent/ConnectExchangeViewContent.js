import React, { useState, useContext, useEffect } from "react";
import ExchangeAccountList from "../ExchangeAccountList";
import ExchangeAccountSettings from "../ExchangeAccountSettings";
import ExchangeAccountDeposit from "../ExchangeAccountDeposit";
import ExchangeAccountWithdraw from "../ExchangeAccountWithdraw";
import ExchangeAccountCreate from "../ExchangeAccountCreate";
import ModalPathContext from "../ModalPathContext";

/**
 * @typedef {Object} DefaultProps
 * @property {string} path Current step path.
 * @property {function} setPath Set current step path function.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ConnectExchangeViewContent = ({}) => {
  const [selectedExchangeInternalId, setExchangeInternalId] = useState("");
  const { setPathParams, pathParams } = useContext(ModalPathContext);

  const path = pathParams.currentPath;
  switch (path) {
    case "realAccounts":
    case "demoAccounts":
    default:
      return <ExchangeAccountList demo={path === "demoAccounts"} />;
    case "createAccount":
    case "createDemoAccount":
      return <ExchangeAccountCreate create={true} demo={path === "createDemoAccount"} />;
    case "connectAccount":
    case "connectDemoAccount":
      return <ExchangeAccountCreate create={false} demo={path === "connectDemoAccount"} />;
    case "settings":
      return <ExchangeAccountSettings />;
    case "deposit":
      return <ExchangeAccountDeposit />;
    case "withdraw":
      return <ExchangeAccountWithdraw />;
  }
};

export default ConnectExchangeViewContent;
