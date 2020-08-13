import React from "react";
import { useIntl } from "react-intl";
import { Box } from "@material-ui/core";
import { Helmet } from "react-helmet";
import { FormattedMessage } from "react-intl";
import { Typography } from "@material-ui/core";
import "./404.scss";
import AstronautImage from "../../images/404/astronaut.svg";
import PlanetImage from "../../images/404/planet.svg";
import AnimalImage from "../../images/404/animal.svg";
import CustomButton from "../../components/CustomButton";
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
      <Box className="astronaut">
        <img className="planetImg" src={PlanetImage} />
        <img src={AstronautImage} />
      </Box>
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
