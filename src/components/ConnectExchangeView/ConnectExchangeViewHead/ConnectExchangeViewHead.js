import React, { useState, useContext, useEffect } from "react";
import ExchangeAccountList from "../ExchangeAccountList";
import ExchangeAccountSettings from "../ExchangeAccountSettings";
import ExchangeAccountDeposit from "../ExchangeAccountDeposit";
import ExchangeAccountWithdraw from "../ExchangeAccountWithdraw";
import ExchangeAccountAdd from "../ExchangeAccountAdd";
import ModalPathContext from "../ModalPathContext";
import LeftIcon from "../../../images/header/chevron-left.svg";
import { Box, Typography } from "@material-ui/core";
import CustomButton from "../../CustomButton";
import SubNavHeader from "../../SubNavHeader";
import "./ConnectExchangeViewHead.scss";
import { FormattedMessage } from "react-intl";
import UserExchangeList from "../../Navigation/Header/UserExchangeList";
import useStoreUserSelector from "../../../hooks/useStoreUserSelector";
import { useForm, FormContext, Controller, useFormContext, useFormMeta } from "react-hook-form";

/**
 * @typedef {Object} DefaultProps
 * @property {string} path Current step path.
 * @property {function} setPath Set current step path function.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ConnectExchangeViewHead = ({ onClose }) => {
  const {
    pathParams: { selectedAccount, previousPath, title, tempMessage, isLoading },
    setTitle,
    resetToPath,
    setPathParams,
    formRef,
  } = useContext(ModalPathContext);
  const methods = useFormContext();
  const storeUser = useStoreUserSelector();

  /**
   * Handle submit buttton click.
   *
   * @type {React.MouseEventHandler} handleClickSubmit
   * @returns {void}
   */
  const handleClick = async () => {
    if (formRef.current) {
      methods.handleSubmit(async (data) => {
        setPathParams((state) => ({ ...state, isLoading: true }));
        const res = await formRef.current.submitForm(data);
        let params = {
          isLoading: false,
          ...(res && {
            currentPath: previousPath,
            previousPath: null,
          }),
        };
        setPathParams((state) => ({ ...state, ...params }));
      })();
    } else {
      onClose();
    }
  };

  // Display temp message for 10 secs.
  useEffect(() => {
    let timeoutId;
    if (tempMessage) {
      timeoutId = setTimeout(() => {
        setPathParams((state) => ({ ...state, tempMessage: "" }));
      }, 10000);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [tempMessage]);

  return (
    <Box className="connectExchangeViewHead">
      <Box className="actionBar" display="flex" flexDirection="row" alignItems="center">
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
        <Typography variant="body1" className="tempMessage">
          {tempMessage}
        </Typography>
        {storeUser.exchangeConnections.length > 0 && <UserExchangeList />}
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
