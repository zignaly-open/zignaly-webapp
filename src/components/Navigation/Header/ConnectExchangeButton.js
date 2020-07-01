import React from "react";
import CustomButton from "../../CustomButton";
import { FormattedMessage } from "react-intl";
import { navigate } from "gatsby";

const ConnectExchangeButton = () => {
  const exchangeAcccountsView = () => {
    navigate("#exchangeAccounts");
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
