import React from "react";
import { Box } from "@mui/material";
import AstronautImage from "../../images/404/astronaut.svg";
import PlanetImage from "../../images/404/planet.svg";
import "./Astronaut.scss";

const Astronaut = () => (
  <>
    <Box className="astronaut">
      <img className="planetImg" src={PlanetImage} />
      <img src={AstronautImage} />
    </Box>
  </>
);

export default Astronaut;
