import React from "react";
import "./NoPositions.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import CustomButton from "../../CustomButton";
import { navigate } from "@reach/router";

const NoPositions = () => {
  const redirect = () => {
    navigate("/copyTraders/browse");
  };

  return (
    <Box
      alignItems="center"
      className="noPositions"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Typography variant="h3">
        <FormattedMessage id="dashboard.positions.nopositions" />
      </Typography>
      <CustomButton className="submitButton" onClick={redirect}>
        <FormattedMessage id="dashboard.browsetraders" />
      </CustomButton>
    </Box>
  );
};

export default NoPositions;
