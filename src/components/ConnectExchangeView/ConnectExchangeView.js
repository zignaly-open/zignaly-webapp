import React, { useState, useRef } from "react";
import "./ConnectExchangeView.scss";
import { Box, Typography } from "@material-ui/core";
import CustomButton from "../CustomButton";
import SubNavHeader from "../SubNavHeader";
import { FormattedMessage } from "react-intl";
import ConnectExchangeViewContent from "./ConnectExchangeViewContent";

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
  const [path, setPath] = useState("connectAccount");
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef(null);

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
        setPath("realAccount");
      },
    },
    {
      id: "accounts.demo",
      onClick: () => {
        setPath("demoAccount");
      },
    },
  ];

  return (
    <Box
      alignItems="center"
      className="connectExchangeView"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Box className="actionBar">
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
  );
};

export default ConnectExchangeView;
