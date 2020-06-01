import React from "react";
import CustomButton from "../../CustomButton";
import { FormattedMessage } from "react-intl";
import { useDispatch } from "react-redux";
import { openExchangeConnectionView } from "../../../store/actions/ui";

const ConnectExchangeButton = () => {
  const dispatch = useDispatch();

  return (
    <>
      <CustomButton
        className="headerButton"
        onClick={() => dispatch(openExchangeConnectionView(true))}
      >
        <FormattedMessage id="menu.connectexchange" />
      </CustomButton>
    </>
  );
};

export default ConnectExchangeButton;
