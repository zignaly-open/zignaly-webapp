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
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import tradeApi from "../../../services/tradeApiClient";
import dayjs from "dayjs";
import Modal from "../../Modal";
import StopCopyingTraderForm from "components/Forms/StopCopyingTraderForm";

/**
 * @typedef {import("../../Graphs/GradientLineChart/GradientLineChart").ChartColorOptions} ChartColorOptions
 * @typedef {import("../../Graphs/GradientLineChart/GradientLineChart").ChartData} ChartData
 * @typedef {import('chart.js').ChartTooltipItem} ChartTooltipItem
 * @typedef {import("services/tradeApiClient.types").DailyReturn} DailyReturn
 * @typedef {import("services/tradeApiClient.types").ProviderEntity} ProviderEntity
 * @typedef {import("services/tradeApiClient.types").ExchangeConnectionEntity} ExchangeConnectionEntity
 * @typedef {import('../../../store/initialState').DefaultState} DefaultState
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
const TraderCard = (props) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const { provider, showSummary, timeFrame, reloadProviders } = props;
  const {
    openPositions,
    floating,
    provType,
    followers,
    disable,
    dailyReturns,
    id,
    quote,
    closedPositions,
    returns,
    aggregateFollowers = [],
    newFollowers,
    providerLink,
    profitSharing,
  } = provider;

  const copyTrader = provType === "copytrading";
  const profitSharingProvider = provType === "profitsharing";

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
          {copyTrader || profitSharingProvider ? "%" : <FormattedMessage id="srv.followers" />}
        </div>
        {(copyTrader || profitSharingProvider) && (
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

  const { darkStyle, selectedExchange } = useStoreSettingsSelector();
  const exchangeConnections = useStoreUserExchangeConnections();
  const storeSession = useStoreSessionSelector();
  const [loading, setLoading] = useState(false);
  const [canDisable, setCanDisable] = useState(!disable);
  const [stopCopyingModal, showStopCopyingModal] = useState(false);
  const type = copyTrader || profitSharingProvider ? "copyt" : "srv";
  const timeframeTranslationId =
    timeFrame === 3650 ? "time.total" : "time." + (timeFrame || 7) + "d";

  const [chartData, setChartData] = useState(/** @type {ChartData} */ ({ values: [], labels: [] }));

  const handleStopCopyingModalClose = () => {
    showStopCopyingModal(false);
  };

  useEffect(() => {
    const values = [];
    const labels = [];
    if (copyTrader || profitSharingProvider) {
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

  const positive = (copyTrader || profitSharingProvider ? returns : newFollowers) >= 0;
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
    if (profitSharingProvider || copyTrader) {
      showStopCopyingModal(true);
    } else {
      stopCopying();
    }
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

  const connectedAccount = exchangeConnections.find(
    (e) => e.internalId === provider.exchangeInternalId,
  );
  const isCopyingWithAnotherAccount =
    connectedAccount && connectedAccount.internalId !== selectedExchange.internalId;
  const exchangeData =
    provider.exchangeInternalIds &&
    provider.exchangeInternalIds.find((item) => item.internalId === selectedExchange.internalId);
  const disconnecting = exchangeData && exchangeData.disconnecting;

  const getCopyButtonTooltip = () => {
    if (!profitSharing && isCopyingWithAnotherAccount) {
      return (
        <FormattedMessage
          id={
            copyTrader || profitSharingProvider
              ? "copyt.follow.anotheraccount"
              : "srv.follow.anotheraccount"
          }
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
            condition={copyTrader || profitSharingProvider}
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
                {copyTrader || profitSharingProvider ? (
                  <>{formatFloat2Dec(returns)}%</>
                ) : (
                  newFollowers
                )}
              </Typography>
              <Typography variant="subtitle1">{`${intl.formatMessage({
                id: copyTrader || profitSharingProvider ? "sort.return" : "srv.newfollowers",
              })} (${intl.formatMessage({
                id: timeframeTranslationId,
              })})`}</Typography>
            </div>
          </ConditionalWrapper>

          {(copyTrader || profitSharingProvider) && (
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
              (!copyTrader && !profitSharingProvider) || dailyReturns.length
                ? positive
                  ? "positive"
                  : "negative"
                : ""
            }`}
          >
            <div className="followers">
              {canDisable ? (
                <h6 className={`callout2 ${colorClass}`}>
                  <FormattedMessage
                    id={copyTrader || profitSharingProvider ? "trader.others" : "provider.others"}
                    values={{
                      count: followers - 1,
                    }}
                  />
                </h6>
              ) : (
                <h6 className="callout1">
                  {followers}{" "}
                  <FormattedMessage
                    id={copyTrader || profitSharingProvider ? "trader.people" : "provider.people"}
                  />
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
                      <FormattedMessage
                        id={copyTrader || profitSharingProvider ? "trader.stop" : "provider.stop"}
                      />
                    </CustomButton>
                  </div>
                </CustomToolip>
              )}
              <CustomButton className="textPurple" onClick={redirectToProfile}>
                <FormattedMessage
                  id={copyTrader || profitSharingProvider ? "trader.view" : "provider.view"}
                />
              </CustomButton>
            </div>
          </div>
        </div>
        {showSummary && (
          <UserSummary
            isCopyTrading={copyTrader || profitSharingProvider}
            providerId={id}
            quote={quote}
          />
        )}
      </div>
    </LazyLoad>
  );
};

export default TraderCard;
