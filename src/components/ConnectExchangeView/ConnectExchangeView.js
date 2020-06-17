import React, { useState, useRef, useReducer } from "react";
import "./ConnectExchangeView.scss";
import { Box, Typography } from "@material-ui/core";
import CustomButton from "../CustomButton";
import SubNavHeader from "../SubNavHeader";
import { FormattedMessage } from "react-intl";
import ConnectExchangeViewContent from "./ConnectExchangeViewContent";
import ModalHeaderContext from "./ModalHeaderContext";

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
  const [path, setPath] = useState("realAccounts");
  const [isLoading, setIsLoading] = useState(false);
  //   const formRef = useRef(null);
  //   const [state, dispatch] = useReducer({});
  //   const ModalHeaderContext = React.createContext({});

  /**
   * Handle submit buttton click.
   *
   * @type {React.MouseEventHandler} handleClickSubmit
   * @returns {void}
   */
  const handleClick = () => {
    setIsLoading(true);
    // console.log(formRef);
    window.dispatchEvent(new Event("submit"));
    // props.onClose();
  };

  const tabs = [
    {
      id: "accounts.real",
      onClick: () => {
        setPath("realAccounts");
      },
    },
    {
      id: "accounts.demo",
      onClick: () => {
        setPath("demoAccounts");
      },
    },
  ];

  //   const [previousPath, setPreviousPath] = useState("");
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
  const value = { pathParams, setPathParams, navigateToPath };

  return (
    <ModalHeaderContext.Provider value={value}>
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
              onClick={() => setPathParams({ currentPath: pathParams.previousPath })}
              loading={isLoading}
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
            <FormattedMessage id="dashboard.connectexchange.bold.title" />
          </Typography>
        </Box>
        <SubNavHeader links={tabs} />
        <ConnectExchangeViewContent path={path} setPath={setPath} />
      </Box>
    </ModalHeaderContext.Provider>
  );
};

export default ConnectExchangeView;
