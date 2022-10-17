import React from "react";
import "./Press.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import ChartBg from "images/login/chartBg.svg";
import Yahoo from "images/login/press/yahoo.svg";
import Forbes from "images/login/press/forbes.svg";
import Bitcoin from "images/login/press/bitcoin.svg";
import Nasdaq from "images/login/press/nasdaq.svg"
import ShieldIcon from "images/login/press/shield.svg"
import dayjs from "dayjs";
import PressQuote from "./PressQuote";

const quotes = [
  {
    logo: Forbes,
  },
  {
    logo: Nasdaq,
  },
  {
    logo: Yahoo,
  },
  {
    logo: Bitcoin,
  },
];

const Press = () => {
  return (
    <Box className="press">
      <div className="chart">
        <img src={ChartBg} />
        <div className="slide" />
      </div>
      <Typography variant="h2">
        <img src={ShieldIcon} />
        <FormattedMessage id="login.press" />
      </Typography>
      <Typography variant="h3">
        <FormattedMessage id="login.press2" />
      </Typography>
      <Box
        className="quotes"
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="center"
      >
        {quotes.map((quote, i) => (
          <PressQuote key={i} quote={quote} />
        ))}
      </Box>
    </Box>
  );
};

export default Press;
