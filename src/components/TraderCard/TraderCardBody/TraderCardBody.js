import React from "react";
import "./TraderCardBody.scss";
import { Box, Typography } from "@material-ui/core";
import Chart from "../../Graphs/Chart";
import UserSummary from "../UserSummary";
import CustomButton from "../../CustomButton";
import PropTypes from "prop-types";
import { navigate } from "@reach/router";
import { FormattedMessage } from "react-intl";

/**
 * @typedef {import("../../../services/tradeApiClient.types").DailyReturn} DailyReturn
 * @typedef {import("../../../services/tradeApiClient.types").ProviderEntity} Provider
 *
 * @typedef {Object} TraderCardBodyPropTypes
 * @property {boolean} showSummary Flag to indicate if summary should be rendered.
 * @property {boolean} isCopyTrading Flag to indicate if the provider is copy trading.
 * @property {number} risk Return for open positions.
 * @property {Array<DailyReturn>} dailyReturns Return for closed positions on the selected period.
 * @property {string} id Provider id.
 * @property {Provider} provider Flag to indicate if the provider is copy trading.
 */

/**
 * Provides a body for a trader card.
 *
 * @param {TraderCardBodyPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const TraderCard = (props) => {
  const { provider } = props;

  const { id, showSummary, risk, isCopyTrading } = provider;
  const dailyReturns = [
    {
      name: "2020-03-29",
      returns: "5.42466341627152",
      positions: 6,
    },
    {
      name: "2020-03-30",
      returns: "15.11468924148286",
      positions: 8,
    },
    {
      name: "2020-04-01",
      returns: "7.52008233572196",
      positions: 5,
    },
    {
      name: "2020-04-02",
      returns: "2.9421316999993",
      positions: 1,
    },
  ];
  let cardId = "traderCard" + id;
  let chartData = [];

  let cumulativeTotalProfits = 0;
  let cumulativeTotalInvested = 0;
  const totalReturns = dailyReturns.reduce((acc, item) => {
    if (isCopyTrading) {
      const returns = typeof item.returns === "number" ? item.returns : parseFloat(item.returns);
      acc += returns;
    } else {
      cumulativeTotalProfits += parseFloat(item.totalProfit);
      cumulativeTotalInvested += parseFloat(item.totalInvested);
      if (cumulativeTotalInvested) {
        acc = (cumulativeTotalProfits / cumulativeTotalInvested) * 100;
      }
    }
    chartData.push(acc);
    return acc;
  }, 0);

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
            {totalReturns.toFixed(2)}%
          </Typography>
          <Typography variant="subtitle1">
            <FormattedMessage id="returns(90D)" />
          </Typography>
        </Box>
        <Box
          alignItems="flex-end"
          className="openPositions"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Typography className="green" variant="h4">
            {risk}%
          </Typography>
          <Typography variant="subtitle1">
            <FormattedMessage id="srv.openpos" />
          </Typography>
        </Box>
      </Box>
      <Box className="traderCardGraph">
        <Chart data={chartData} id={cardId}>
          <canvas className="chartCanvas" id={cardId} />
        </Chart>
        <Box
          alignItems="center"
          className="actions"
          display="flex"
          flexDirection="row"
          justifyContent="space-around"
        >
          <CustomButton className="textDefault">
            <FormattedMessage id="trader.stop" />
          </CustomButton>
          <CustomButton className="textDefault" onClick={() => navigate("/copyTrader/profile")}>
            <FormattedMessage id="trader.view" />
          </CustomButton>
        </Box>
      </Box>
      {showSummary && <UserSummary />}
    </Box>
  );
};

TraderCard.propTypes = {
  //   dailyReturns: PropTypes.array.isRequired,
  //   id: PropTypes.string.isRequired,
  //   isCopyTrading: PropTypes.bool.isRequired,
  //   risk: PropTypes.number.isRequired,
  //   showSummary: PropTypes.bool.isRequired,
  provider: PropTypes.object.isRequired,
};

export default TraderCard;
