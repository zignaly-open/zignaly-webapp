import React from "react";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage, useIntl } from "react-intl";
import "./TipBox.scss";

const TipBox = ({ icon, title, description }) => (
  <Box className="tipBox">
    <img src={icon} />
    <Typography variant="body2">
      {typeof title === "object" ? title : <FormattedMessage id={title} />}
    </Typography>
    <Typography variant="body1">
      <FormattedMessage id={description} />
    </Typography>
  </Box>
);

export default TipBox;
