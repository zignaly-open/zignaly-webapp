import React from "react";
import "./TraderCardBody.scss";
import { Box, Typography } from "@material-ui/core";
import LineChart from "../../Graphs/LineChart";
import UserSummary from "../UserSummary";
import CustomButton from "../../CustomButton";
import { navigate } from "@reach/router";
import { FormattedMessage, useIntl } from "react-intl";
import CustomToolip from "../../CustomTooltip";
import { toNumber } from "lodash";
import { useSelector } from "react-redux";
import { formatFloat2Dec } from "../../../utils/format";

/**
 * @typedef {import("../../Graphs/LineChart/LineChart").ChartColorOptions} ChartColorOptions
 * @typedef {import("../../Graphs/LineChart/LineChart").ChartData} ChartData
 * @typedef {import('chart.js').ChartTooltipItem} ChartTooltipItem
 * @typedef {import("../../../services/tradeApiClient.types").DailyReturn} DailyReturn
 * @typedef {import("../../../services/tradeApiClient.types").ProviderEntity} ProviderEntity
 * @typedef {import('../../../store/initialState').DefaultState} DefaultState
 *
 */

/**
 * Format tooltip content.
 * @param {ChartTooltipItem} tooltipItem Tooltip object.
 * @returns {React.ReactNode} Tooltip content.
 */
const tooltipFormat = (tooltipItem) => (
  <Box className="traderCardTooltip">
    <Box>{formatFloat2Dec(tooltipItem.yLabel) + "%"}</Box>
    <Box className="subtitleTooltip">{tooltipItem.xLabel}</Box>
  </Box>
);

/**
 * @typedef {Object} TraderCardBodyPropTypes
 * @property {boolean} showSummary Flag to indicate if summary should be rendered.
 * @property {ProviderEntity} provider The provider to display.
 * @property {number} timeFrame Selected timeFrame.
 */

/**
 * Provides a body for a trader card.
 *
 * @param {TraderCardBodyPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const TraderCard = (props) => {
  const intl = useIntl();
  const { provider, showSummary, timeFrame } = props;
  const {
    openPositions,
    floating,
    isCopyTrading,
    followers,
    disable,
    dailyReturns,
    id,
    quote,
    closedPositions,
    returns,
  } = provider;
  /**
   * Settings darkStyle selector.
   *
   * @param {DefaultState} state Redux store state data.
   * @return {boolean} Flag that indicates if darkStyle is enabled.
   */
  const darkStyleSelector = (state) => state.settings.darkStyle;
  const darkStyle = useSelector(darkStyleSelector);

  /**
   * @type {ChartData}
   */
  let chartData = { values: [], labels: [] };
  //   let cumulativeTotalProfits = 0;
  //   let cumulativeTotalInvested = 0;
  dailyReturns.reduce((acc, item) => {
    // if (isCopyTrading) {
    acc += item.returns;
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
    chartData.values.push(acc);
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

  if (returns < 0) {
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
        <CustomToolip
          title={
            <FormattedMessage
              id="srv.closedpos.tooltip"
              values={{ count: closedPositions, days: timeFrame }}
            />
          }
        >
          <Box
            className="returns"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Typography className={colorClass} variant="h4">
              {formatFloat2Dec(returns)}%
            </Typography>
            <Typography variant="subtitle1">{`${intl.formatMessage({
              id: "sort.return",
            })} (${intl.formatMessage({ id: "time." + timeFrame + "d" })})`}</Typography>
          </Box>
        </CustomToolip>

        <CustomToolip
          title={<FormattedMessage id="srv.openpos.tooltip" values={{ count: openPositions }} />}
        >
          <Box
            alignItems="flex-end"
            className="openPositions"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Typography className="green" variant="h4">
              {formatFloat2Dec(floating)}%
            </Typography>
            <Typography variant="subtitle1">
              <FormattedMessage id="srv.openpos" />
            </Typography>
          </Box>
        </CustomToolip>
      </Box>
      <Box>
        <Box className="traderCardGraph">
          <Box className="chartWrapper">
            <LineChart
              chartData={chartData}
              colorsOptions={colorsOptions}
              tooltipFormat={tooltipFormat}
            />
          </Box>
        </Box>
        <Box
          className={`actionsWrapper ${returns >= 0 ? "positive" : "negative"}`}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <Box className="followers" display="flex" flexDirection="row" justifyContent="center">
            {!disable ? (
              <h6 className="callout2 green">
                <FormattedMessage
                  id={isCopyTrading ? "trader.others" : "provider.others"}
                  values={{
                    count: followers - 1,
                  }}
                />
              </h6>
            ) : (
              <h6 className="callout1">
                {followers}{" "}
                <FormattedMessage id={isCopyTrading ? "trader.people" : "provider.people"} />
              </h6>
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
              <CustomButton className={darkStyle ? "textPurple" : "textDefault"}>
                <FormattedMessage id={isCopyTrading ? "trader.stop" : "provider.stop"} />
              </CustomButton>
            )}
            <CustomButton
              className={darkStyle ? "textPurple" : "textDefault"}
              onClick={() => navigate(`/copyTraders/${provider.id}/profile`)}
            >
              <FormattedMessage id={isCopyTrading ? "trader.view" : "provider.view"} />
            </CustomButton>
          </Box>
        </Box>
      </Box>
      {showSummary && <UserSummary providerId={id} quote={quote} />}
    </Box>
  );
};

export default TraderCard;
