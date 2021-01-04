import React, { useState } from "react";
import "./TraderCardBody.scss";
import { Typography } from "@material-ui/core";
import LineChart from "../../Graphs/GradientLineChart";
import UserSummary from "../UserSummary";
import CustomButton from "../../CustomButton";
import ConditionalWrapper from "../../ConditionalWrapper";
import { navigate } from "gatsby";
import { FormattedMessage, useIntl } from "react-intl";
import CustomToolip from "../../CustomTooltip";
import { formatFloat2Dec } from "../../../utils/format";
import { generateStats } from "../../../utils/stats";
import moment from "moment";
import LazyLoad from "react-lazyload";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import { useStoreUserExchangeConnections } from "../../../hooks/useStoreUserSelector";
import { useDispatch } from "react-redux";
import { showErrorAlert, showSuccessAlert } from "../../../store/actions/ui";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import tradeApi from "../../../services/tradeApiClient";
import { ConfirmDialog } from "../../Dialogs";

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
  const dispatch = useDispatch();
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
    aggregateFollowers = [],
    newFollowers,
  } = provider;

  /**
   * Format tooltip content.
   * @param {ChartTooltipItem} tooltipItem Tooltip object.
   * @returns {React.ReactNode} Tooltip content.
   */
  const tooltipFormat = (tooltipItem) => {
    const data = dailyReturns[tooltipItem.index];

    return (
      <div className="traderCardTooltip">
        <div>
          {formatFloat2Dec(tooltipItem.yLabel)}{" "}
          {isCopyTrading ? "%" : <FormattedMessage id="srv.followers" />}
        </div>
        <div className="subtitleTooltip">{moment(tooltipItem.xLabel).format("YYYY/MM/DD")}</div>
        <div className="subtitleTooltip">
          <FormattedMessage
            id="srv.closedposcount"
            values={{
              count: data.positions,
            }}
          />
        </div>
      </div>
    );
  };

  const { darkStyle, selectedExchange } = useStoreSettingsSelector();
  const exchangeConnections = useStoreUserExchangeConnections();
  const storeSession = useStoreSessionSelector();
  const [loading, setLoading] = useState(false);
  const [canDisable, setCanDisable] = useState(!disable);
  const type = isCopyTrading ? "copyt" : "srv";

  /**
   * @type {ChartData}
   */
  let chartData = { values: [], labels: [] };
  if (isCopyTrading) {
    generateStats(dailyReturns, { dateKey: "name" }, (date, data) => {
      chartData.values.push(data ? data.returns : 0);
      chartData.labels.push(date.toDate());
    });
  } else {
    let currentFollowers = followers;
    // Find followers data for the past 7 days
    for (let i = 0; i < 7; i++) {
      const date = moment().subtract(i, "d").format("YYYY-MM-DD");
      const followerData = aggregateFollowers.find((f) => f.date === date);
      if (followerData) {
        currentFollowers = followerData.totalFollowers;
      }
      chartData.values.unshift(currentFollowers);
      chartData.labels.unshift(date);
    }
  }

  const positive = (isCopyTrading ? returns : newFollowers) >= 0;
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

  if (!positive) {
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

  const initConfirmConfig = {
    titleTranslationId: `confirm.${type}.unfollow.title`,
    messageTranslationId: `confirm.${type}.unfollow.message`,
    visible: false,
  };

  const [confirmConfig, setConfirmConfig] = useState(initConfirmConfig);

  const confirmAction = () => {
    setConfirmConfig({
      ...initConfirmConfig,
      visible: true,
    });
  };

  const stopCopying = () => {
    setLoading(true);
    const payload = {
      disable: true,
      token: storeSession.tradeApi.accessToken,
      providerId: provider.id,
      type: "connected",
    };

    tradeApi
      .providerDisable(payload)
      .then((response) => {
        if (response) {
          dispatch(showSuccessAlert(`${type}.unfollow.alert.title`, `${type}.unfollow.alert.body`));
          setCanDisable(false);
        }
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const connectedAccount = exchangeConnections.find(
    (a) => a.internalId === provider.exchangeInternalId,
  );

  return (
    <LazyLoad height="310px" offset={600} once>
      <ConfirmDialog
        confirmConfig={confirmConfig}
        executeActionCallback={stopCopying}
        setConfirmConfig={setConfirmConfig}
      />
      <div className="traderCardBody">
        <div className="returnsBox">
          <ConditionalWrapper
            condition={isCopyTrading}
            wrapper={(_children) => (
              <CustomToolip
                title={
                  <FormattedMessage
                    id="srv.closedpos.tooltip"
                    values={{ count: closedPositions, days: timeFrame }}
                  />
                }
              >
                {_children}
              </CustomToolip>
            )}
          >
            <div className="returns">
              <Typography className={colorClass} variant="h4">
                {isCopyTrading ? <>{formatFloat2Dec(returns)}%</> : newFollowers}
              </Typography>
              <Typography variant="subtitle1">{`${intl.formatMessage({
                id: isCopyTrading ? "sort.return" : "srv.newfollowers",
              })} (${intl.formatMessage({
                id: "time." + (timeFrame || 7) + "d",
              })})`}</Typography>
            </div>
          </ConditionalWrapper>

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
              !isCopyTrading || dailyReturns.length ? (positive ? "positive" : "negative") : ""
            }`}
          >
            <div className="followers">
              {canDisable ? (
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
              {canDisable &&
                (connectedAccount && selectedExchange.internalId !== provider.exchangeInternalId ? (
                  <CustomToolip
                    title={
                      <FormattedMessage
                        id={
                          isCopyTrading
                            ? "copyt.follow.anotheraccount"
                            : "srv.follow.anotheraccount"
                        }
                        values={{
                          account: connectedAccount.internalName,
                        }}
                      />
                    }
                  >
                    <div>
                      <CustomButton className="textPurple" disabled={true}>
                        <FormattedMessage id={isCopyTrading ? "trader.stop" : "provider.stop"} />
                      </CustomButton>
                    </div>
                  </CustomToolip>
                ) : (
                  <CustomButton className="textPurple" loading={loading} onClick={confirmAction}>
                    <FormattedMessage id={isCopyTrading ? "trader.stop" : "provider.stop"} />
                  </CustomButton>
                ))}
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
