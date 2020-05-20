import React from "react";
import "./FAQ.scss";
import { Box, Typography } from "@material-ui/core";

const FAQ = () => {
  return (
    <Box
      alignItems="flex-start"
      className="faq"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      <Typography className="title" variant="h4">
        frequently asked questions
      </Typography>
      <Box
        alignItems="center"
        className="questionContainer"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Typography className="question" variant="caption">
          How do i start trading?
        </Typography>
        <Typography className="question" variant="caption">
          How can i withdraw my balance?
        </Typography>
        <Typography className="question" variant="caption">
          Who are signal providers?
        </Typography>
        <Typography className="question" variant="caption">
          Who are copy traders?
        </Typography>
      </Box>
    </Box>
  );
};

export default FAQ;
