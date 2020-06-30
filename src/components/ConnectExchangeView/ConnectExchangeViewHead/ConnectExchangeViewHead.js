import React, { useContext, useEffect } from "react";
import ModalPathContext from "../ModalPathContext";
import LeftIcon from "../../../images/header/chevron-left.svg";
import { Box, Typography } from "@material-ui/core";
import CustomButton from "../../CustomButton";
import "./ConnectExchangeViewHead.scss";
import { FormattedMessage } from "react-intl";
import UserExchangeList from "../../Navigation/Header/UserExchangeList";
import { useStoreUserSelector } from "../../../hooks/useStoreUserSelector";
import { useFormContext } from "react-hook-form";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";

/**
 * @typedef {Object} DefaultProps
 * @property {function} onClose Close modal callback.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ConnectExchangeViewHead = ({ onClose }) => {
  const {
    pathParams: { selectedAccount, currentPath, previousPath, title, tempMessage, isLoading },
    resetToPath,
    setPathParams,
    formRef,
  } = useContext(ModalPathContext);
  const methods = useFormContext();
  const storeUser = useStoreUserSelector();
  const storeSettings = useStoreSettingsSelector();

  /**
   * Handle submit buttton click.
   *
   * @type {React.MouseEventHandler}
   * @returns {Promise<void>} Form action async promise.
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
    /**
     * @type {NodeJS.Timeout}
     */
    let timeoutId;
    if (tempMessage) {
      timeoutId = setTimeout(() => {
        setPathParams((state) => ({ ...state, tempMessage: "" }));
      }, 10000);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [tempMessage, setPathParams]);

  // Update account
  useEffect(() => {
    if (selectedAccount) {
      console.log(storeSettings.selectedExchange);
      setPathParams((state) => ({ ...state, selectedAccount: storeSettings.selectedExchange }));
    }
  }, [storeSettings.selectedExchange]);

  return (
    <Box className="connectExchangeViewHead">
      <Box alignItems="center" className="actionBar" display="flex" flexDirection="row">
        {previousPath && (
          <CustomButton
            className="textPurple borderPurple"
            onClick={() => resetToPath(previousPath)}
            startIcon={<img className="icon" src={LeftIcon} />}
          >
            <FormattedMessage id="accounts.back" />
          </CustomButton>
        )}
        <CustomButton className="submitButton" loading={isLoading} onClick={handleClick}>
          <FormattedMessage id="accounts.done" />
        </CustomButton>
        <Typography className="tempMessage" variant="body1">
          {tempMessage}
        </Typography>
        {storeUser.exchangeConnections.length > 0 && !selectedAccount && <UserExchangeList />}
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
