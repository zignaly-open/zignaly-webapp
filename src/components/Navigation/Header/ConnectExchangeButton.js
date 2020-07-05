import React from "react";
import CustomButton from "../../CustomButton";
import { FormattedMessage } from "react-intl";
import { navigate as navigateReach } from "@reach/router";

const ConnectExchangeButton = () => {
  const exchangeAcccountsView = () => {
    navigateReach("#exchangeAccounts");
  };

  return (
    <>
      <CustomButton className="headerButton" onClick={exchangeAcccountsView}>
        <FormattedMessage id="menu.connectexchange" />
      </CustomButton>
    </>
  );
};

export default ConnectExchangeButton;
