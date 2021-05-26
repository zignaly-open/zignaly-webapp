import React from "react";
import "./Press.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import ChartBg from "images/login/chartBg.svg";
import AP from "images/login/press/ap.svg";
import Forbes from "images/login/press/forbes.svg";
import Bitcoin from "images/login/press/bitcoin.svg";
import dayjs from "dayjs";
import PressQuote from "./PressQuote";

const quotes = [
  {
    date: dayjs("2021-04-14"),
    quote:
      "Zignaly raises USD 3 Million in private sale to launch NFT-Based insurance protocol powered through their native utility token Zigcoin",
    url: "",
    logo: AP,
  },
  {
    date: dayjs("2021-04-14"),
    quote:
      "Zignaly has built a business to leverage the social predisposition of humans to lower the barrier of entry to cryptocurrency trading",
    url: "",
    logo: Forbes,
  },
  {
    date: dayjs("2021-04-14"),
    quote:
      "Zignaly has created an environment where trading platforms, users and expert traders can benefit from one anothers input while contributing to a comprehensive ecosystem",
    url: "",
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
        <FormattedMessage id="login.press" />
      </Typography>
      <Box
        display="flex"
        className="quotes"
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="center"
      >
        {quotes.map((quote, i) => (
          <PressQuote quote={quote} key={i} />
        ))}
      </Box>
    </Box>
  );
};

export default Press;
