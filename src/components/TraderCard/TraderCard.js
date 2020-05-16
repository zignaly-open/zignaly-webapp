import React from 'react';
import './TraderCard.scss';
import { Box, Typography } from '@material-ui/core';
import ConnectedIcon from '../../images/dashboard/connected.svg';
import LogoIcon from '../../images/logo/logoIcon.svg';
import Chart from '../Graphs/Chart';
import UserSummary from './UserSummary';
import CustomButton from '../CustomButton';
import PropTypes from "prop-types"

const TraderCard = (props) => {
    const { data, showSummary } = props
    let id = "traderCard"+data

    return (
      <Box
        bgcolor="grid.main"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        className="traderCard"
      >
        <Box
          className="traderCardHeader"
          display="flex"
          flexDirection="row"
          alignItems="center"
        >
          <img src={LogoIcon} className="logoIcon" alt="zignaly" />
          <Box
            className="traderCardHeaderTitleBox"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box
              className="nameBox"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="flex-start"
                alignItems="flex-start"
              >
                <Typography variant="h4" className="name">
                  Ritoku Trendalyst
                </Typography>
                <img
                  src={ConnectedIcon}
                  className="connectedIcon"
                  alt="zignaly"
                />
              </Box>
              <Typography variant="caption" className="tradeType">
                Trades BTC
              </Typography>
            </Box>
            <Box
              className="commissionBox"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              alignItems="flex-end"
            >
              <Typography variant="h4">20%</Typography>
              <Typography variant="subtitle1">commission fee</Typography>
            </Box>
          </Box>
        </Box>
        <Box className="traderCardBody">
          <Box
            className="returnsBox"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box
              className="returns"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <Typography variant="h4" className="green">
                16%
              </Typography>
              <Typography variant="subtitle1">returns(90D)</Typography>
            </Box>
            <Box
              className="openPositions"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              alignItems="flex-end"
            >
              <Typography variant="h4" className="green">
                10%
              </Typography>
              <Typography variant="subtitle1">open positions</Typography>
            </Box>
          </Box>
          <Box className="traderCardGraph">
            <Chart id={id}>
              <canvas id={id} className="chartCanvas"></canvas>
            </Chart>
            <Box
              className="actions"
              display="flex"
              flexDirection="row"
              justifyContent="space-around"
              alignItems="center"
            >
              <CustomButton className="text-default">Stop Copying</CustomButton>
              <CustomButton className="text-default">View Trader</CustomButton>
            </Box>
          </Box>
          {showSummary && <UserSummary />}
        </Box>
      </Box>
    )
}

TraderCard.propTypes = {
  data: PropTypes.number,
  showSummary: PropTypes.bool,
}

export default TraderCard;
