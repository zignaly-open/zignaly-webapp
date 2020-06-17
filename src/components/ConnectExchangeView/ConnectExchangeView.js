import React, { useState, useRef, useReducer } from "react";
import "./ConnectExchangeView.scss";
import { Box, Typography } from "@material-ui/core";
import CustomButton from "../CustomButton";
import SubNavHeader from "../SubNavHeader";
import { FormattedMessage } from "react-intl";
import ConnectExchangeViewContent from "./ConnectExchangeViewContent";
import ModalPathContext from "./ModalPathContext";

/**
 * @typedef {Object} DefaultProps
 * @property {Function} onClose
 */

/**
 * Connect exchange component.
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} Connect exchange element.
 */
const ConnectExchangeView = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle submit buttton click.
   *
   * @type {React.MouseEventHandler} handleClickSubmit
   * @returns {void}
   */
  const handleClick = () => {
    setIsLoading(true);
    window.dispatchEvent(new Event("submit"));
    // props.onClose();
  };

  const [pathParams, setPathParams] = useState({
    currentPath: "realAccounts",
  });

  const navigateToPath = (path, selectedAccount) => {
    setPathParams({
      currentPath: path,
      previousPath: pathParams.currentPath,
      selectedAccount,
    });
  };

  const resetToPath = (path) => {
    setPathParams({
      currentPath: path,
    });
  };

  const setTitle = (title) => {
    setPathParams({
      ...pathParams,
      title,
    });
  };
  const value = { pathParams, setPathParams, navigateToPath, resetToPath, setTitle };

  return (
    <ModalPathContext.Provider value={value}>
      <Box
        alignItems="center"
        className="connectExchangeView"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Box className="actionBar">
          {pathParams.previousPath && (
            <CustomButton
              className="submitButton"
              onClick={() => resetToPath(pathParams.previousPath)}
            >
              <FormattedMessage id="accounts.back" />
            </CustomButton>
          )}
          <CustomButton className="submitButton" onClick={handleClick} loading={isLoading}>
            <FormattedMessage id="accounts.done" />
          </CustomButton>
        </Box>
        <Box className="titleBar">
          <Typography variant="h1">
            {pathParams.title || <FormattedMessage id="dashboard.connectexchange.bold.title" />}
          </Typography>
        </Box>
        {/* <SubNavHeader links={tabs} /> */}
        <ConnectExchangeViewContent />
      </Box>
    </ModalPathContext.Provider>
  );
};

export default ConnectExchangeView;
