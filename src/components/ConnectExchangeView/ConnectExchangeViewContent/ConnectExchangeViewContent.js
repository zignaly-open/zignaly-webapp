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

  const openExchangeAction = (internalId, path) => {
    setExchangeInternalId(internalId);
    setPath(path);
  };

  switch (path) {
    case "realAccount":
    case "demoAccount":
    default:
      return <ExchangeAccountDetails type={path} openExchangeAction={openExchangeAction} />;
    case "settings":
      return <ExchangeAccountSettings internalId={selectedExchangeInternalId} />;
    case "deposit":
      return <ExchangeAccountDeposit />;
    case "withdraw":
      return <ExchangeAccountWithdraw />;
  }

  //   return (
  //     <Box>
  //       <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
  //         <Tab label="Item One" {...a11yProps(0)} />
  //         <Tab label="Item Two" {...a11yProps(1)} />
  //         <Tab label="Item Three" {...a11yProps(2)} />
  //       </Tabs>
  //       <TabPanel value="" index={0}>
  //         Item One
  //       </TabPanel>
  //       <TabPanel value={value} index={1}>
  //         Item Two
  //       </TabPanel>
  //     </Box>
  //   );

  // if (!selectedExchangeInternalId) {
  //     return <ExchangeAccountDetails type={path} />;
  // } else {

  // }
};

export default ConnectExchangeViewContent;
