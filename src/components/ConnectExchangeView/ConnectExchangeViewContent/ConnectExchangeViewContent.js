import React, { useState } from "react";
import ExchangeAccountList from "../ExchangeAccountList";
import ExchangeAccountSettings from "../ExchangeAccountSettings";
import ExchangeAccountDeposit from "../ExchangeAccountDeposit";
import ExchangeAccountWithdraw from "../ExchangeAccountWithdraw";

/**
 * @typedef {Object} DefaultProps
 * @property {string} path Current step path.
 * @property {function} setPath Set current step path function.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ConnectExchangeViewContent = ({ path, setPath }) => {
  //   const [path, setPath] = useState("realAccount");
  const [selectedExchangeInternalId, setExchangeInternalId] = useState("realAccount");
  //   const storeSettings = useStoreSettingsSelector();
  //   const location = useLocationHash();

  //   let hash = window.location.hash ? window.location.hash.substr(1) : "";
  //   if (!hash) {
  //     // get hash by looking at selected exchange
  //   }

  /**
   * Navigate to an action page for the selected exchange.
   * @param {string} internalId Selected internal exchange id.
   * @param {string} selectedPath Action step path.
   * @returns {void}
   */
  const openExchangeAccountAction = (internalId, selectedPath) => {
    setExchangeInternalId(internalId);
    setPath(selectedPath);
  };

  switch (path) {
    case "realAccount":
    case "demoAccount":
    default:
      return (
        <ExchangeAccountList openExchangeAccountAction={openExchangeAccountAction} type={path} />
      );
    case "settings":
      return <ExchangeAccountSettings internalId={selectedExchangeInternalId} />;
    case "deposit":
      return <ExchangeAccountDeposit />;
    case "withdraw":
      return <ExchangeAccountWithdraw />;
  }
};

export default ConnectExchangeViewContent;
