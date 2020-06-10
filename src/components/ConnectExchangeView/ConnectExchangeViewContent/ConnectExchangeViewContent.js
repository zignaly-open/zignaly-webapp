import React from "react";
import ExchangeAccountInfo from "../ExchangeAccountInfo";
import ExchangeAccountSettings from "../ExchangeAccountSettings";
import ExchangeAccountDeposit from "../ExchangeAccountDeposit";
import ExchangeAccountWithdraw from "../ExchangeAccountWithdraw";

const ConnectExchangeViewContent = () => {
  //   console.log(window.location.pathname, window.location.hash);
  const hash = window.location.hash ? window.location.hash.substr(1) : "";
  switch (hash) {
    case "realAccount":
    case "demoAccount":
      return <ExchangeAccountInfo type={hash} />;
    case "settings":
      return <ExchangeAccountSettings />;
    case "deposit":
      return <ExchangeAccountDeposit />;
    case "withdraw":
      return <ExchangeAccountWithdraw />;
    default:
      return <ExchangeAccountInfo type="realAccount" />;
  }
};

export default ConnectExchangeViewContent;
