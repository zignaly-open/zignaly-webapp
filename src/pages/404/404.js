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

const NotFound = () => {
  const intl = useIntl();
  return (
    <Box
      className="notFoundPage"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height={1}
    >
      <Helmet>
        <title>
          {`${intl.formatMessage({
            id: "notfound.title",
          })} | ${intl.formatMessage({ id: "product" })}`}
        </title>
      </Helmet>
      <Box className="astronaut">
        <img src={PlanetImage} className="planetImg" />
        <img src={AstronautImage} />
      </Box>
      <Typography variant="h1">
        <FormattedMessage id="notfound.why" />
      </Typography>
      <Typography variant="body1" className="desc">
        <FormattedMessage id="notfound.desc" />
      </Typography>
      <img src={AnimalImage} />
      <CustomButton className="bgPurple" href="/dashboard/positions">
        <FormattedMessage id="notfound.home" />
      </CustomButton>
      <Typography variant="h3" className="code">
        404
      </Typography>
    </Box>
  );
};

export default NotFound;
