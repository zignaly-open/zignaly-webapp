import React from "react";
import { Box, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import "./TipBox.scss";

/**
 * @typedef {Object} TipBoxPropTypes
 * @property {string} icon Top icon
 * @property {JSX.Element|string} title Title
 * @property {string} description Description
 */

/**
 * Provides a tip box.
 *
 * @param {TipBoxPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const TipBox = ({ icon, title, description }) => (
  <Box className="tipBox">
    <img src={icon} />
    <Typography className="bold" variant="body1">
      {typeof title === "object" ? title : <FormattedMessage id={title} />}
    </Typography>
    <Typography variant="body1">
      <FormattedMessage id={description} />
    </Typography>
  </Box>
);

export default TipBox;
