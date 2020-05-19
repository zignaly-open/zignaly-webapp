import React from "react";
import "./TraderCardHeader.scss";
import { Box, Typography } from "@material-ui/core";
import ConnectedIcon from "../../../images/dashboard/connected.svg";
import LogoIcon from "../../../images/logo/logoIcon.svg";

const TraderCardHeader = () => {
  return (
    <Box alignItems="center" className="traderCardHeader" display="flex" flexDirection="row">
      <img alt="zignaly" className="logoIcon" src={LogoIcon} />
      <Box
        alignItems="center"
        className="traderCardHeaderTitleBox"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Box
          className="nameBox"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Box
            alignItems="flex-start"
            display="flex"
            flexDirection="row"
            justifyContent="flex-start"
          >
            <Typography className="name" variant="h4">
              Ritoku Trendalyst
            </Typography>
            <img alt="zignaly" className="connectedIcon" src={ConnectedIcon} />
          </Box>
          <Typography className="tradeType" variant="caption">
            Trades BTC
          </Typography>
        </Box>
        <Box
          alignItems="flex-end"
          className="commissionBox"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Typography variant="h4">20%</Typography>
          <Typography variant="subtitle1">commission fee</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TraderCardHeader;
