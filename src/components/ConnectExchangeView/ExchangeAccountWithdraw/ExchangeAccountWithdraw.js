import React from "react";

const ExchangeAccountWithdraw = () => {
  path = "demoAccount";
  switch (path) {
    case "realAccount":
    case "demoAccount":
      return <ExchangeAccountInfo type={path} />;
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

export default ExchangeAccountWithdraw;
