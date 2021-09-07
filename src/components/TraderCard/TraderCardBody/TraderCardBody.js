import React, { useState, useEffect } from "react";
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
import tradeApi from "../../../services/tradeApiClient";
import dayjs from "dayjs";
import Modal from "../../Modal";
import StopCopyingTraderForm from "components/Forms/StopCopyingTraderForm";
import useSelectedExchange from "hooks/useSelectedExchange";

/**
 * @typedef {import("../../Graphs/GradientLineChart/GradientLineChart").ChartColorOptions} ChartColorOptions
 * @typedef {import("../../Graphs/GradientLineChart/GradientLineChart").ChartData} ChartData
 * @typedef {import('chart.js').ChartTooltipItem} ChartTooltipItem
 * @typedef {import("services/tradeApiClient.types").DailyReturn} DailyReturn
 * @typedef {import("services/tradeApiClient.types").ProviderEntity} ProviderEntity
 * @typedef {import("services/tradeApiClient.types").ExchangeConnectionEntity} ExchangeConnectionEntity
 * @typedef {import('../../../store/initialState').DefaultState} DefaultState
 * @typedef {import("../../../services/tradeApiClient.types").NewAPIProvidersPayload} NewAPIProvidersPayload
 *
 */

/**
 * @typedef {Object} TraderCardBodyPropTypes
 * @property {boolean} showSummary Flag to indicate if summary should be rendered.
 * @property {ProviderEntity} provider The provider to display.
 * @property {number} timeFrame Selected timeFrame.
 * @property {Function} reloadProviders reload providers list.
 */

/**
 * Provides a body for a trader card.
 *
 * @param {TraderCardBodyPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const TraderCard = ({ provider, showSummary, timeFrame, reloadProviders }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const {
    openPositions,
    floating,
    followers,
    disable,
    dailyReturns,
    closedPositions,
    returns,
    aggregateFollowers = [],
    newFollowers,
    providerLink,
    id: providerId,
    exchangeInternalId,
    exchangeInternalIds,
    profitSharing,
    CTorPS,
    liquidated,
    globalReturn,
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
          {CTorPS ? "%" : <FormattedMessage id="srv.followers" />}
        </div>
        {CTorPS && (
          <FormattedMessage
            id="srv.closedposcount"
            values={{
              count: data.positions,
            }}
          />
        )}
        <div className="subtitleTooltip">{moment(tooltipItem.xLabel).format("YYYY/MM/DD")}</div>
      </div>
    );
  };

  const { darkStyle } = useStoreSettingsSelector();
  const selectedExchange = useSelectedExchange();
  const exchangeConnections = useStoreUserExchangeConnections();
  const [loading, setLoading] = useState(false);
  const [canDisable, setCanDisable] = useState(!disable);
  const [stopCopyingModal, showStopCopyingModal] = useState(false);
  const traderType = CTorPS ? "copyt" : "srv";
  const timeframeTranslationId =
    timeFrame === 3650 ? "time.total" : "time." + (timeFrame || 7) + "d";

  const [chartData, setChartData] = useState(/** @type {ChartData} */ ({ values: [], labels: [] }));

  const handleStopCopyingModalClose = () => {
    showStopCopyingModal(false);
  };

  useEffect(() => {
    setCanDisable(!disable);
  }, [disable]);

  useEffect(() => {
    const values = [];
    const labels = [];
    if (CTorPS) {
      if (!dailyReturns.length) return;
      const options = {
        dateKey: "name",
        endDate: dayjs(dailyReturns[dailyReturns.length - 1].name),
      };
      generateStats(dailyReturns, options, (date, data) => {
        if (data) {
          values.push(data.returns);
          labels.push(date.toDate());
        }
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
        values.unshift(currentFollowers);
        labels.unshift(date);
      }
    }
    setChartData({ values, labels });
  }, [dailyReturns, followers]);

  const positive = (CTorPS ? globalReturn : newFollowers) >= 0 && !liquidated;
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
    navigate(providerLink);
  };

  const handleProviderDisconnect = () => {
    if (CTorPS) {
      showStopCopyingModal(true);
    } else {
      stopCopying();
    }
  };

  const stopCopying = () => {
    setLoading(true);
    const payload = {
      disable: true,
      providerId: providerId,
    };

    tradeApi
      .providerDisable(payload)
      .then((response) => {
        if (response) {
          dispatch(
            showSuccessAlert(
              `${traderType}.unfollow.alert.title`,
              `${traderType}.unfollow.alert.body`,
            ),
          );
          reloadProviders();
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

  const connectedAccount = exchangeConnections.find((e) => e.internalId === exchangeInternalId);
  const isCopyingWithAnotherAccount =
    connectedAccount && connectedAccount.internalId !== selectedExchange.internalId;
  const exchangeData =
    exchangeInternalIds &&
    exchangeInternalIds.find((item) => item.internalId === selectedExchange.internalId);
  const disconnecting = exchangeData ? exchangeData.disconnecting : false;

  const getCopyButtonTooltip = () => {
    if (!profitSharing && isCopyingWithAnotherAccount) {
      return (
        <FormattedMessage
          id={CTorPS ? "copyt.follow.anotheraccount" : "srv.follow.anotheraccount"}
          values={{
            account: connectedAccount.internalName,
          }}
        />
      );
    }

    return "";
  };

  return (
    <LazyLoad height="310px" offset={600} once>
      <Modal
        onClose={handleStopCopyingModalClose}
        persist={false}
        size="small"
        state={stopCopyingModal}
      >
        <StopCopyingTraderForm
          callback={reloadProviders}
          onClose={handleStopCopyingModalClose}
          provider={provider}
        />
      </Modal>
      <div className="traderCardBody">
        <div className="returnsBox">
          <ConditionalWrapper
            condition={CTorPS && !liquidated}
            wrapper={(_children) => (
              <CustomToolip
                title={
                  <>
                    {timeFrame !== 3650 ? (
                      <FormattedMessage
                        id="srv.closedpos.tooltip.1a"
                        values={{
                          timeframe: timeFrame,
                        }}
                      />
                    ) : (
                      <FormattedMessage id="srv.closedpos.tooltip.1b" />
                    )}
                    <FormattedMessage
                      id="srv.closedpos.tooltip.2"
                      values={{
                        closeCount: closedPositions,
                        returns: formatFloat2Dec(returns),
                        openCount: openPositions,
                        floating: formatFloat2Dec(floating),
                      }}
                    />
                  </>
                }
              >
                {_children}
              </CustomToolip>
            )}
          >
            <div className="returns">
              <Typography className={colorClass} variant="h4">
                {liquidated ? (
                  intl.formatMessage({ id: "srv.liquidated" })
                ) : CTorPS ? (
                  <>{formatFloat2Dec(globalReturn)}%</>
                ) : (
                  newFollowers
                )}
              </Typography>
              <Typography variant="subtitle1">{`${intl.formatMessage({
                id: CTorPS ? "sort.return" : "srv.newfollowers",
              })} (${intl.formatMessage({
                id: timeframeTranslationId,
              })})`}</Typography>
            </div>
          </ConditionalWrapper>

          {CTorPS && !liquidated && (
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
              !CTorPS || dailyReturns.length ? (positive ? "positive" : "negative") : ""
            }`}
          >
            <div className="followers">
              {canDisable ? (
                <h6 className={`callout2 ${colorClass}`}>
                  <FormattedMessage
                    id={CTorPS ? "trader.others" : "provider.others"}
                    values={{
                      count: followers - 1,
                    }}
                  />
                </h6>
              ) : (
                <h6 className="callout1">
                  {followers} <FormattedMessage id={CTorPS ? "trader.people" : "provider.people"} />
                </h6>
              )}
            </div>

            <div className="actions">
              {!disconnecting && canDisable && (
                <CustomToolip title={getCopyButtonTooltip()}>
                  <div>
                    <CustomButton
                      className="textPurple"
                      disabled={!profitSharing && isCopyingWithAnotherAccount}
                      loading={loading}
                      onClick={handleProviderDisconnect}
                    >
                      <FormattedMessage id={CTorPS ? "trader.stop" : "provider.stop"} />
                    </CustomButton>
                  </div>
                </CustomToolip>
              )}
              <CustomButton className="textPurple" onClick={redirectToProfile}>
                <FormattedMessage id={CTorPS ? "trader.view" : "provider.view"} />
              </CustomButton>
            </div>
          </div>
        </div>
        {showSummary && <UserSummary provider={provider} />}
      </div>
    </LazyLoad>
  );
};

export default TraderCard;
