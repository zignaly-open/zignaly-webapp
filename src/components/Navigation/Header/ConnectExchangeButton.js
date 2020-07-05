import React from "react";
import CustomButton from "../../CustomButton";
import { FormattedMessage } from "react-intl";
import { navigate as navigateReach } from "@reach/router";

const ConnectExchangeButton = () => {
  return (
    <>
      <CustomButton
        className="headerButton"
        onClick={() => {
          navigateReach("#exchangeAccounts");
        }}
      >
        <FormattedMessage id="menu.connectexchange" />
      </CustomButton>
    </>
  );
};

export default ConnectExchangeButton;
