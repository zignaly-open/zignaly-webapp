import React from "react";
import "./TraderCardBody.scss";
import { Box, Typography } from "@material-ui/core";
import GenericChart from "../../Graphs/Chart";
import UserSummary from "../UserSummary";
import CustomButton from "../../CustomButton";
import { navigate } from "@reach/router";
import { FormattedMessage } from "react-intl";

/**
 * @typedef {import('../../../utils/chart').ChartColorOptions} ChartColorOptions
 * @typedef {import('../../../utils/chart').ChartData} ChartData
 */

/**
 * @typedef {import("../../../services/tradeApiClient.types").DailyReturn} DailyReturn
 * @typedef {import("../../../services/tradeApiClient.types").ProviderEntity} Provider
 *
 *
 * @typedef {Object} TraderCardBodyPropTypes
 * @property {boolean} showSummary Flag to indicate if summary should be rendered.
 * @property {Provider} provider The provider to display.
 */

/**
 * Provides a body for a trader card.
 *
 * @param {TraderCardBodyPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const TraderCard = (props) => {
  const { provider, showSummary } = props;
  const { id, risk, isCopyTrading, followers, disable } = provider;
  const dailyReturns = [
    {
      name: "2020-03-29",
      returns: "5.42466341627152",
      positions: 6,
    },
    {
      name: "2020-03-30",
      returns: "-25.11468924148286",
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

  /**
   * @type {ChartData} chartData
   */
  let chartData = { values: [], labels: [] };

  //   let cumulativeTotalProfits = 0;
  //   let cumulativeTotalInvested = 0;
  const totalReturns = dailyReturns.reduce((acc, item) => {
    // if (isCopyTrading) {
    const returns = typeof item.returns === "number" ? item.returns : parseFloat(item.returns);
    acc += returns;
    // } else {
    //   //   cumulativeTotalProfits += parseFloat(item.totalProfit);
    //   //   cumulativeTotalInvested += parseFloat(item.totalInvested);
    //   //   if (cumulativeTotalInvested) {
    //   //     acc = (cumulativeTotalProfits / cumulativeTotalInvested) * 100;
    //   //   }
    // }
    // chartData.push({
    //   day: item.name,
    //   returns: acc.toFixed(2),
    // });
    chartData.values.push(acc.toFixed(2));
    chartData.labels.push(item.name);
    return acc;
  }, 0);

  let colorClass = "green";

  /**
   * @type {ChartColorOptions} colorsOptions
   */
  let colorsOptions = {
    backgroundColor: "",
    borderColor: "#00cb3a",
    gradientColor1: "#b6f2cb",
    gradientColor2: "#e5f8ed",
  };

  if (totalReturns < 0) {
    colorClass = "red";
    colorsOptions = {
      ...colorsOptions,
      borderColor: "#f0226f",
      gradientColor1: "#fccbde",
      gradientColor2: "#fcecf3",
    };
  }

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
          <Typography className={colorClass} variant="h4">
            {totalReturns.toFixed(2)}%
          </Typography>
          <Typography variant="subtitle1">
            <FormattedMessage id="srv.returnsperiod" />
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
      <Box>
        <Box className="traderCardGraph">
          <Box className="chartWrapper">
            <GenericChart chartData={chartData} colorsOptions={colorsOptions} id={cardId}>
              <canvas className="chartCanvas" id={cardId} />
            </GenericChart>
          </Box>
        </Box>
        <Box
          className={`actionsWrapper ${totalReturns >= 0 ? "positive" : "negative"}`}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <Box className="followers" display="flex" flexDirection="row" justifyContent="center">
            {!disable ? (
              <h6 className="callout2 green">You and {followers} are copying this trader</h6>
            ) : (
              <h6 className="callout1">{followers} people copying this trader</h6>
            )}
          </Box>

          <Box
            alignItems="center"
            className="actions"
            display="flex"
            flexDirection="row"
            justifyContent="space-around"
          >
            {!disable && (
              <CustomButton className="textDefault">
                <FormattedMessage id={isCopyTrading ? "trader.stop" : "provider.stop"} />
              </CustomButton>
            )}
            <CustomButton className="textDefault" onClick={() => navigate("/copyTrader/profile")}>
              <FormattedMessage id={isCopyTrading ? "trader.view" : "provider.view"} />
            </CustomButton>
          </Box>
        </Box>
      </Box>
      {showSummary && <UserSummary />}
    </Box>
  );
};

export default TraderCard;
