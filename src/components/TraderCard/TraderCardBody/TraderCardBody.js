import React from "react";
import "./TraderCardBody.scss";
import { Typography } from "@material-ui/core";
import LineChart from "../../Graphs/GradientLineChart";
import UserSummary from "../UserSummary";
import CustomButton from "../../CustomButton";
import { navigate } from "gatsby";
import { FormattedMessage, useIntl } from "react-intl";
import CustomToolip from "../../CustomTooltip";
import { formatFloat2Dec } from "../../../utils/format";
import moment from "moment";
import LazyLoad from "react-lazyload";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";

/**
 * @typedef {import("../../Graphs/GradientLineChart/GradientLineChart").ChartColorOptions} ChartColorOptions
 * @typedef {import("../../Graphs/GradientLineChart/GradientLineChart").ChartData} ChartData
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
  <div className="traderCardTooltip">
    <div>{formatFloat2Dec(tooltipItem.yLabel) + "%"}</div>
    <div className="subtitleTooltip">{moment(tooltipItem.xLabel).format("DD/MM/YYYY")}</div>
  </div>
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

  const { darkStyle } = useStoreSettingsSelector();

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
    borderColor: darkStyle ? "#14672f" : "#00cb3a",
    gradientColor1: darkStyle ? "#152324" : "#b6f2cb",
    gradientColor2: darkStyle ? "#181e26" : "#e5f8ed",
  };

  if (returns < 0) {
    colorClass = "red";
    colorsOptions = {
      ...colorsOptions,
      borderColor: darkStyle ? "#761d45" : "#f0226f",
      gradientColor1: darkStyle ? "#271728" : "#fccbde",
      gradientColor2: darkStyle ? "#1f1827" : "#fcecf3",
    };
  }

  const redirectToProfile = () => {
    if (isCopyTrading) {
      navigate(`/copyTraders/${provider.id}`);
    } else {
      navigate(`/signalProviders/${provider.id}`);
    }
  };

  return (
    <LazyLoad height="310px" offset={600} once>
      <div className="traderCardBody">
        <div className="returnsBox">
          <CustomToolip
            title={
              <FormattedMessage
                id="srv.closedpos.tooltip"
                values={{ count: closedPositions, days: timeFrame }}
              />
            }
          >
            <div className="returns">
              <Typography className={colorClass} variant="h4">
                {formatFloat2Dec(returns)}%
              </Typography>
              <Typography variant="subtitle1">{`${intl.formatMessage({
                id: "sort.return",
              })} (${intl.formatMessage({ id: "time." + timeFrame + "d" })})`}</Typography>
            </div>
          </CustomToolip>

          {isCopyTrading && (
            <CustomToolip
              title={
                <FormattedMessage id="srv.openpos.tooltip" values={{ count: openPositions }} />
              }
            >
              <div className="openPositions">
                <Typography className={floating >= 0 ? "green" : "red"} variant="h4">
                  {formatFloat2Dec(floating)}%
                </Typography>
                <Typography variant="subtitle1">
                  <FormattedMessage id="srv.openpos" />
                </Typography>
              </div>
            </CustomToolip>
          )}
        </div>
        <div>
          <div className="traderCardGraph">
            <div className="chartWrapper">
              {/* <LazyLoad height="100%" offset={600} once> */}
              <LineChart
                chartData={chartData}
                colorsOptions={colorsOptions}
                tooltipFormat={tooltipFormat}
              />
              {/* </LazyLoad> */}
            </div>
          </div>
          <div
            className={`actionsWrapper ${
              dailyReturns.length ? (returns >= 0 ? "positive" : "negative") : ""
            }`}
          >
            <div className="followers">
              {!disable ? (
                <h6 className={`callout2 ${colorClass}`}>
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
            </div>

            <div className="actions">
              {!disable && (
                <CustomButton className="textPurple">
                  <FormattedMessage id={isCopyTrading ? "trader.stop" : "provider.stop"} />
                </CustomButton>
              )}
              <CustomButton className="textPurple" onClick={redirectToProfile}>
                <FormattedMessage id={isCopyTrading ? "trader.view" : "provider.view"} />
              </CustomButton>
            </div>
          </div>
        </div>
        {showSummary && <UserSummary isCopyTrading={isCopyTrading} providerId={id} quote={quote} />}
      </div>
    </LazyLoad>
  );
};

export default TraderCard;
