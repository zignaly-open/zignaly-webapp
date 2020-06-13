import React, { useState } from "react";
import ExchangeAccountDetails from "../ExchangeAccountDetails";
import ExchangeAccountSettings from "../ExchangeAccountSettings";
import ExchangeAccountDeposit from "../ExchangeAccountDeposit";
import ExchangeAccountWithdraw from "../ExchangeAccountWithdraw";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import useLocationHash from "../../../hooks/useLocationHash";
import { Tabs, TabPanel, Box } from "@material-ui/core";

const ConnectExchangeViewContent = ({ path, setPath }) => {
  //   const [path, setPath] = useState("realAccount");
  const [selectedExchangeInternalId, setExchangeInternalId] = useState("realAccount");
  //   const storeSettings = useStoreSettingsSelector();
  //   const location = useLocationHash();

  //   let hash = window.location.hash ? window.location.hash.substr(1) : "";
  //   if (!hash) {
  //     // get hash by looking at selected exchange
  //   }

  const openExchangeAccountAction = (internalId, path) => {
    setExchangeInternalId(internalId);
    setPath(path);
  };

  switch (path) {
    case "realAccount":
    case "demoAccount":
    default:
      return (
        <ExchangeAccountDetails type={path} openExchangeAccountAction={openExchangeAccountAction} />
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
