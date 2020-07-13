import React from "react";
import "./FAQ.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import DocsIcon from "../../images/documents.svg";

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
        <FormattedMessage id="faq" />
      </Typography>
      <Box
        alignItems="center"
        className="questionContainer"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Typography className="question" variant="caption">
          <FormattedMessage id="faq.question1" />
        </Typography>
        <Typography className="question" variant="caption">
          <FormattedMessage id="faq.question2" />
        </Typography>
        <Typography className="question" variant="caption">
          <FormattedMessage id="faq.question3" />
        </Typography>
        <Typography className="question" variant="caption">
          <FormattedMessage id="faq.question4" />
        </Typography>
        <Box
          className="docsBox"
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-start"
        >
          <img alt="Zignaly-Docs" src={DocsIcon} className="docsIcon" />
          <Typography className="docs" variant="h6">
            <FormattedMessage id="faq.documentation" />
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default FAQ;
