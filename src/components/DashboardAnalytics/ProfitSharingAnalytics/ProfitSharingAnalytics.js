import React, { useEffect, useState } from "react";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import { showErrorAlert } from "../../../store/actions/ui";
import { useDispatch } from "react-redux";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import TradingPerformance from "../../Provider/Analytics/TradingPerformance";
import TotalEquityBar from "../../TotalEquityBar";
import EquityPart from "../../TotalEquityBar/EquityPart";
import { formatFloat } from "../../../utils/format";
import ProfitSharingTable from "./ProfitSharingTable";
import ProfitSharingEquityChart from "./ProfitSharingEquityChart";
import "./ProfitSharingAnalytics.scss";

/**
 * @typedef {import("../../../services/tradeApiClient.types").ProfitSharingBalanceHistory} ProfitSharingBalanceHistory
 * @typedef {import("../../../services/tradeApiClient.types").ProviderEntity} ProviderEntity
 */

/**
 * @typedef {Object} DefaultProps
 * @property {ProviderEntity} provider
 */

/**
 * Render analytics panels for profit sharing providers.
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} JSX
 */
const ProfitSharingAnalytics = ({ provider }) => {
  const storeSession = useStoreSessionSelector();
  const [performance, setPerformance] = useState(null);
  const [performanceLoading, setPerformanceLoading] = useState(false);
  const [balanceHistory, setBalanceHistory] = useState(
    /** @type {ProfitSharingBalanceHistory} */ (null),
  );
  const [balanceHistoryLoading, setBalanceHistoryLoading] = useState(false);
  const storeSettings = useStoreSettingsSelector();

  const dispatch = useDispatch();

  const getProviderPerformance = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      providerId: provider.id,
    };
    setPerformanceLoading(true);

    tradeApi
      .providerPerformanceGet(payload)
      .then((response) => {
        setPerformance(response);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setPerformanceLoading(false);
      });
  };
  useEffect(getProviderPerformance, []);

  const getProfitSharingBalanceHistory = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      providerId: provider.id,
      exchangeInternalId: storeSettings.selectedExchange.internalId,
    };
    setBalanceHistoryLoading(true);

    tradeApi
      .getProfitSharingBalanceHistory(payload)
      .then((response) => {
        setBalanceHistory(response);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setBalanceHistoryLoading(false);
      });
  };
  useEffect(getProfitSharingBalanceHistory, []);

  return (
    <Box
      alignItems="center"
      className="profitSharingAnalytics"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      {performanceLoading ? (
        <CircularProgress color="primary" size={50} />
      ) : (
        performance && <TradingPerformance performance={performance} />
      )}
      {balanceHistoryLoading ? (
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          mt="50px"
        >
          <CircularProgress color="primary" size={50} />
        </Box>
      ) : (
        balanceHistory && (
          <>
            <TotalEquityBar>
              <>
                <EquityPart
                  name="profitsharing.initAllocated"
                  value={
                    <>
                      {balanceHistory.quote} {formatFloat(balanceHistory.initBalance)}
                    </>
                  }
                />
                <span className="operator">|</span>
                <EquityPart
                  name="profitsharing.currentAllocated"
                  //   info={<>= USDT {formatFloat(10.1)}</>}
                  value={
                    <>
                      {/* <Typography className={`number1`}> */}
                      {balanceHistory.quote} {formatFloat(balanceHistory.currentBalance)}
                      {/* </Typography> */}
                      {/* <Typography className={`number1 pnlPercent ${color}`}>10%</Typography> */}
                    </>
                  }
                />
                <span className="operator">|</span>
                <EquityPart
                  name="profitsharing.retain"
                  value={
                    <>
                      <Typography className="number1">
                        {balanceHistory.quote} {formatFloat(0.004)}
                      </Typography>
                    </>
                  }
                />
                <span className="operator">|</span>
                <EquityPart
                  name="profitsharing.watermark"
                  value={
                    <>
                      {balanceHistory.quote} {formatFloat(balanceHistory.watermark)}
                    </>
                  }
                />
              </>
            </TotalEquityBar>

            <Box className="chartTableBox" display="flex" width={1}>
              <ProfitSharingEquityChart
                currentBalance={balanceHistory.currentBalance}
                data={balanceHistory.entries}
              />
              <ProfitSharingTable data={balanceHistory.entries} />
            </Box>
          </>
        )
      )}
    </Box>
  );
};

export default ProfitSharingAnalytics;
