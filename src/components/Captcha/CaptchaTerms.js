import React from "react";
import { Box, Typography } from "@material-ui/core";
import "./CaptchaTerms.scss";

const CaptchaTerms = () => {
  return (
    <Box className="captchaTerms">
      <Typography color="textSecondary" variant="subtitle1">
        Protected by reCAPTCHA (
        <a href="https://policies.google.com/privacy" rel="noreferrer" target="_blank">
          Privacy
        </a>
        &nbsp;|&nbsp;
        <a href="https://policies.google.com/terms" rel="noreferrer" target="_blank">
          Terms
        </a>
        )
      </Typography>
    </Box>
  );
};

export default CaptchaTerms;
