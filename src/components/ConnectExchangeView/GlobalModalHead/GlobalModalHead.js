import React, { useContext, useEffect } from "react";
import ModalPathContext from "../ModalPathContext";
import LeftIcon from "../../../images/header/chevron-left.svg";
import { Box, Typography } from "@material-ui/core";
import CustomButton from "../../CustomButton";
import "./GlobalModalHead.scss";
import { FormattedMessage } from "react-intl";
import UserExchangeList from "../../Navigation/Header/UserExchangeList";
import { useStoreUserSelector } from "../../../hooks/useStoreUserSelector";
import { useFormContext } from "react-hook-form";

/**
 * @typedef {Object} DefaultProps
 * @property {React.ReactElement} actionBar Action bar component.
 * @property {React.ReactElement} titleBar Title bar component.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const GlobalModalHead = ({ actionBar, titleBar }) => {
  return (
    <Box className="globalModalHead">
      <Box alignItems="center" className="actionBar" display="flex" flexDirection="row">
        {actionBar}
      </Box>
      <Box className="titleBar">{titleBar}</Box>
    </Box>
  );
};

export default GlobalModalHead;
