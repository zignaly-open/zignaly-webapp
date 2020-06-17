import React, { useState, useContext, useEffect } from "react";
import ExchangeAccountList from "../ExchangeAccountList";
import ExchangeAccountSettings from "../ExchangeAccountSettings";
import ExchangeAccountDeposit from "../ExchangeAccountDeposit";
import ExchangeAccountWithdraw from "../ExchangeAccountWithdraw";
import ExchangeAccountCreate from "../ExchangeAccountCreate";
import ModalPathContext from "../ModalPathContext";
import LeftIcon from "../../../images/header/chevron-left.svg";
import { Box, Typography } from "@material-ui/core";
import CustomButton from "../../CustomButton";
import SubNavHeader from "../../SubNavHeader";
import "./ConnectExchangeViewHead.scss";
import { FormattedMessage } from "react-intl";

/**
 * @typedef {Object} DefaultProps
 * @property {string} path Current step path.
 * @property {function} setPath Set current step path function.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ConnectExchangeViewHead = ({}) => {
  const { pathParams, setTitle, resetToPath, setPathParams } = useContext(ModalPathContext);
  const { selectedAccount, previousPath, title, tempMessage, isLoading } = pathParams;
  //   const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle submit buttton click.
   *
   * @type {React.MouseEventHandler} handleClickSubmit
   * @returns {void}
   */
  const handleClick = () => {
    // setIsLoading(true);
    setPathParams({ ...pathParams, isLoading: true });
    window.dispatchEvent(new Event("submit"));
    // props.onClose();
  };

  useEffect(() => {
    let timeoutId;
    if (tempMessage) {
      console.log(tempMessage);
      timeoutId = setTimeout(() => {
        setPathParams({ ...pathParams, isLoading: false });
      }, 5000);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [tempMessage]);

  return (
    <Box className="connectExchangeViewHead">
      <Box className="actionBar">
        {previousPath && (
          <CustomButton
            className="textPurple borderPurple"
            onClick={() => resetToPath(previousPath)}
            startIcon={<img className="icon" src={LeftIcon} />}
          >
            <FormattedMessage id="accounts.back" />
          </CustomButton>
        )}
        <CustomButton className="submitButton" onClick={handleClick} loading={isLoading}>
          <FormattedMessage id="accounts.done" />
        </CustomButton>
        <Box className="tempMessage">{tempMessage}</Box>
      </Box>
      <Box className="titleBar">
        <Typography variant="h1">
          {title || <FormattedMessage id="dashboard.connectexchange.bold.title" />}
        </Typography>
      </Box>
    </Box>
  );
};

export default ConnectExchangeViewHead;
