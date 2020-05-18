import React from "react";
import "./TraderCard.scss";
import { Box, Typography } from "@material-ui/core";
import ConnectedIcon from "../../images/dashboard/connected.svg";
import LogoIcon from "../../images/logo/logoIcon.svg";
import Chart from "../Graphs/Chart";
import UserSummary from "./UserSummary";
import CustomButton from "../CustomButton";
import PropTypes from "prop-types";
import { navigate } from "@reach/router";

const TraderCard = (props) => {
  const { data, showSummary } = props;
  let id = "traderCard" + data;

  return (
    <Box
      bgcolor="grid.main"
      className="traderCard"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
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
      <Box className="traderCardBody">
        <Box
          alignItems="center"
          className="returnsBox"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Box
            className="returns"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Typography className="green" variant="h4">
              16%
            </Typography>
            <Typography variant="subtitle1">returns(90D)</Typography>
          </Box>
          <Box
            alignItems="flex-end"
            className="openPositions"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Typography className="green" variant="h4">
              10%
            </Typography>
            <Typography variant="subtitle1">open positions</Typography>
          </Box>
        </Box>
        <Box className="traderCardGraph">
          <Chart id={id}>
            <canvas className="chartCanvas" id={id} />
          </Chart>
          <Box
            alignItems="center"
            className="actions"
            display="flex"
            flexDirection="row"
            justifyContent="space-around"
          >
            <CustomButton className="textDefault">Stop Copying</CustomButton>
            <CustomButton className="textDefault" onClick={() => navigate("/copyTrader/profile")}>
              View Trader
            </CustomButton>
          </Box>
        </Box>
        {showSummary && <UserSummary />}
      </Box>
    </Box>
  );
};

TraderCard.propTypes = {
  data: PropTypes.number.isRequired,
  showSummary: PropTypes.bool.isRequired,
};

export default TraderCard;
