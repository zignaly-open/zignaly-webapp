import React from "react";
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
  /**
   * Handle submit buttton click.
   *
   * @type {React.MouseEventHandler} handleClickSubmit
   * @returns {void}
   */
  const handleClick = () => {
    props.onClose();
  };

  const tabs = [
    {
      id: "accounts.real",
      to: "#realAccount",
      // onClick: ()=> dispatch(openExchangeConnectionView(false))}
    },
    {
      id: "accounts.demo",
      to: "#demoAccount",
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
        <CustomButton className="submitButton" onClick={handleClick}>
          <FormattedMessage id="accounts.done" />
        </CustomButton>
      </Box>
      <Box className="titleBar">
        <Typography variant="h1">
          <FormattedMessage id="dashboard.connectexchange.bold.title" />
        </Typography>
      </Box>
      <SubNavHeader links={tabs} />
      <ConnectExchangeViewContent />
    </Box>
  );
};

export default ConnectExchangeView;
