import React from "react";
import { useIntl } from "react-intl";
import { Box } from "@mui/material";
import { Helmet } from "react-helmet";
import { FormattedMessage } from "react-intl";
import { Typography } from "@mui/material";
import "./404.scss";
import AnimalImage from "../../images/404/animal.svg";
import CustomButton from "../../components/CustomButton";
import Astronaut from "../../components/Astronaut";
import { withPrefix } from "gatsby";

const NotFound = () => {
  const intl = useIntl();
  return (
    <Box
      alignItems="center"
      className="notFoundPage"
      display="flex"
      flexDirection="column"
      height={1}
      justifyContent="center"
    >
      <Helmet>
        <title>
          {`${intl.formatMessage({
            id: "notfound.title",
          })} | ${intl.formatMessage({ id: "product" })}`}
        </title>
      </Helmet>

      <Astronaut />
      <Typography variant="h1">
        <FormattedMessage id="notfound.why" />
      </Typography>
      <Typography className="desc" variant="body1">
        <FormattedMessage id="notfound.desc" />
      </Typography>
      <img src={AnimalImage} />
      <CustomButton className="bgPurple" href={withPrefix("dashboard")}>
        <FormattedMessage id="notfound.home" />
      </CustomButton>
      <Typography className="code" variant="h3">
        404
      </Typography>
    </Box>
  );
};

export default NotFound;
