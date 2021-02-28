import React, { useContext, useEffect } from "react";
import ModalPathContext from "../ModalPathContext";
import LeftIcon from "../../../images/header/chevron-left.svg";
import { Box, Typography, useMediaQuery } from "@material-ui/core";
import CustomButton from "../../CustomButton";
import "./ConnectExchangeViewHead.scss";
import { FormattedMessage } from "react-intl";
import UserExchangeList from "../../Navigation/Header/UserExchangeList";
import MobileExchangeList from "../../Navigation/MobileHeader/MobileExchangeList";
import { useStoreUserExchangeConnections } from "../../../hooks/useStoreUserSelector";
import { useFormContext } from "react-hook-form";
import GlobalModalHead from "../GlobalModalHead";
import { useTheme } from "@material-ui/core/styles";

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
    pathParams: { currentPath, previousPath, title, tempMessage, isLoading },
    resetToPath,
    setPathParams,
    formRef,
  } = useContext(ModalPathContext);
  const methods = useFormContext();
  const exchangeConnections = useStoreUserExchangeConnections();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  /**
   * Handle submit button click.
   *
   * @type {React.MouseEventHandler}
   * @returns {Promise<void>} Form action async promise.
   */
  const handleClick = async () => {
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

  return (
    <Box className="connectExchangeViewHead">
      <GlobalModalHead
        actionBar={
          <>
            {previousPath && (
              <CustomButton
                className="textPurple borderPurple back"
                onClick={() => resetToPath(previousPath)}
                startIcon={<img className="icon iconPurple" src={LeftIcon} />}
              >
                <FormattedMessage id="accounts.back" />
              </CustomButton>
            )}
            {!previousPath ? (
              <CustomButton className="submitButton done" onClick={() => onClose()}>
                <FormattedMessage id="accounts.done" />
              </CustomButton>
            ) : (
              formRef.current && (
                <CustomButton
                  className="submitButton save"
                  loading={isLoading}
                  onClick={handleClick}
                >
                  <FormattedMessage id="form.button.save" />
                </CustomButton>
              )
            )}
            {!isMobile && tempMessage && (
              <Typography className="tempMessage" variant="body1">
                {tempMessage}
              </Typography>
            )}

            {exchangeConnections.length > 0 &&
              ["demoAccounts", "realAccounts"].includes(currentPath) &&
              (isMobile ? <MobileExchangeList /> : <UserExchangeList />)}
            {isMobile && tempMessage && (
              <Typography className="tempMessage" variant="body1">
                {tempMessage}
              </Typography>
            )}
          </>
        }
        titleBar={
          <Typography variant="h1">
            {title || <FormattedMessage id="dashboard.connectexchange.bold.title" />}
          </Typography>
        }
      />
    </Box>
  );
};

export default ConnectExchangeViewHead;
