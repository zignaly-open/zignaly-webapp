import React from "react";
import "./TraderCardBody.scss";
import { Box, Typography } from "@material-ui/core";
import Chart from "../../Graphs/Chart";
import UserSummary from "../UserSummary";
import CustomButton from "../../CustomButton";
import PropTypes from "prop-types";
import { navigate } from "@reach/router";

const TraderCard = (props) => {
  const { data, showSummary } = props;
  let id = "traderCard" + data;

  return (
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
  );
};

TraderCard.propTypes = {
  data: PropTypes.number.isRequired,
  showSummary: PropTypes.bool.isRequired,
};

export default TraderCard;
