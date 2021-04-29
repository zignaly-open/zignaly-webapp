import React, { useEffect, useState } from "react";
import { isArray, isEqual, pick } from "lodash";
import { FormProvider, useForm } from "react-hook-form";
import { createWidgetOptions } from "../../../tradingView/tradingViewOptions";
import tradeApi from "../../../services/tradeApiClient";
import StrategyForm from "../StrategyForm/StrategyForm";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import PositionsTable from "../../Dashboard/PositionsTable/PositionsTable";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { showErrorAlert, showSuccessAlert } from "../../../store/actions/ui";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import {
  useStoreUserData,
  useStoreUserExchangeConnections,
} from "../../../hooks/useStoreUserSelector";
import useTradingTerminal from "../../../hooks/useTradingTerminal";
import "./TradingView.scss";
import { createExchangeConnectionEmptyEntity } from "../../../services/tradeApiClient.types";
import TradingViewContext from "./TradingViewContext";
import useTradingViewContext from "hooks/useTradingViewContext";
import CustomButton from "components/CustomButton";

/**
 * @typedef {any} TVWidget
 * @typedef {import("../../../services/tradeApiClient.types").PositionEntity} PositionEntity
 * @typedef {import("../../../services/tradeApiClient.types").UserPositionsCollection} UserPositionsCollection
 * @typedef {import("../../../services/tradeApiClient.types").MarketSymbolsCollection} MarketSymbolsCollection
 * @typedef {import("../../../services/tradeApiClient.types").DefaultProviderGetObject} ProviderEntity
 * @typedef {import("../../../hooks/usePositionsList").PositionsCollectionType} PositionsCollectionType
 * @typedef {import('services/tradeApiClient.types').MarketSymbol} MarketSymbol
 */

/**
 * @typedef {Object} TradingViewProps
 *
 * @property {string} positionId Position id (optional) for trading view edit mode.
 */

/**
 * Trading terminal component.
 *
 * @param {TradingViewProps} props Component props.
 *
 * @returns {JSX.Element} Trading terminal element.
 */
const TradingViewEdit = (props) => {
  const { positionId } = props;
  const tradingViewContext = useTradingViewContext();
  const { setLastPrice, lastPrice, setProviderService, setUpdatedAt } = tradingViewContext;
  const {
    instantiateWidget,
    tradingViewWidget,
    isSelfHosted,
    changeSymbol,
    removeWidget,
  } = useTradingTerminal(setLastPrice);
  const [positionEntity, setPositionEntity] = useState(/** @type {PositionEntity} */ (null));
  // Raw position entity (for debug)
  const [positionRawData, setPositionRawData] = useState(/** @type {*} */ (null));
  const [selectedSymbol, setSelectedSymbol] = useState(/** @type {MarketSymbol} */ (null));
  const [recoverPositionLoading, setRecoverPositionLoading] = useState(false);
  const [exchange, setExchange] = useState(createExchangeConnectionEmptyEntity());
  const storeSession = useStoreSessionSelector();
  const storeSettings = useStoreSettingsSelector();
  const exchangeConnections = useStoreUserExchangeConnections();
  const storeUserData = useStoreUserData();
  const dispatch = useDispatch();

  /**
   * Initialize state variables that depend on loaded position.
   *
   * @param {PositionEntity} responseData Position entity retrieved from Trade API response.
   * @returns {Void} None.
   */
  const initializePosition = (responseData) => {
    setPositionEntity(responseData);
  };

  /**
   * Load position symbol exchange market data.
   *
   * @param {PositionEntity} positionData The position entity to load dependent data for.
   *
   * @returns {Void} None.
   */
  const getMarketData = (positionData) => {
    const marketDataPayload = {
      token: storeSession.tradeApi.accessToken,
      exchangeInternalId: positionData.exchangeInternalId,
      exchange: positionData.exchange,
      exchangeType: positionData.exchangeType,
    };

    tradeApi
      .exchangeConnectionMarketDataGet(marketDataPayload)
      .then((data) => {
        const symbolData = data.find((d) => d.short === positionData.short);
        setSelectedSymbol(symbolData);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
    // if (!positionData.closed) {
    // } else {
    //   // When position is closed avoid get market data and rely on position symbol data.
    //   const symbolData = assign(createMarketSymbolEmptyValueObject(), {
    //     id: positionData.symbol,
    //     base: positionData.base,
    //     baseId: positionData.base,
    //     quote: positionData.quote,
    //     quoteId: positionData.quote,
    //     short: positionData.short,
    //     tradeViewSymbol: positionData.tradeViewSymbol,
    //     limits: {},
    //   });
    //   setSelectedSymbol(symbolData);
    // }
  };

  /**
   *
   * @param {String} exchangeInternalId Exchange internal id.
   * @returns {Void} None.
   */
  const filterExchange = (exchangeInternalId) => {
    let found = exchangeConnections.find((item) => item.internalId === exchangeInternalId);
    if (found) {
      setExchange(found);
    }
  };

  /**
   * Fetch a position on position edit mode.
   *
   * @returns {Void} None.
   */
  const fetchPosition = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      positionId,
      internalExchangeId: storeSettings.selectedExchange.internalId,
    };

    tradeApi
      .positionGet(payload)
      .then((data) => {
        initializePosition(data);
        getMarketData(data);
        filterExchange(data.internalExchangeId);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });

    if (storeUserData.isAdmin) {
      // Get position raw data for debug
      tradeApi.positionRawGet(payload).then((data) => {
        setPositionRawData(data);
      });
    }
  };

  useEffect(() => {
    fetchPosition();
  }, []);

  useEffect(() => {
    // Reload widget on theme change
    removeWidget();
    bootstrapWidget();
  }, [storeSettings.darkStyle]);

  /**
   * Callback that to be notified when position updates are performed.
   *
   * @returns {Void} None.
   */
  const notifyPositionUpdate = () => {
    fetchPosition();
    setUpdatedAt(new Date());
  };

  const isLoading = tradingViewWidget === null || !positionEntity || !selectedSymbol;

  const bootstrapWidget = () => {
    // Skip if TV widget already exists or TV library is not ready.
    if (!selectedSymbol || tradingViewWidget) return;

    const options = {
      exchange: storeSettings.selectedExchange,
      symbolsData: [selectedSymbol],
      tradeApiToken: storeSession.tradeApi.accessToken,
      symbol: positionEntity.tradeViewSymbol,
      darkStyle: storeSettings.darkStyle,
    };

    const widgetOptions = createWidgetOptions(options);
    instantiateWidget(widgetOptions);
  };

  // Create Trading View widget when TV external library is ready.
  useEffect(bootstrapWidget, [selectedSymbol, tradingViewWidget]);

  // Force initial price notification.
  const initDataFeedSymbol = () => {
    if (isSelfHosted || !tradingViewWidget) return;

    const checkExist = setInterval(() => {
      if (
        tradingViewWidget &&
        tradingViewWidget.iframe &&
        tradingViewWidget.iframe.contentWindow &&
        selectedSymbol
      ) {
        changeSymbol(selectedSymbol.tradeViewSymbol, exchange);
        clearInterval(checkExist);
      }
    }, 100);
  };
  useEffect(initDataFeedSymbol, [tradingViewWidget]);

  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      entryType: "LONG",
      leverage: 1,
      positionSize: "",
      realInvestment: "",
      stopLossPrice: "",
      trailingStopPrice: "",
      units: "",
      dcaTargetPricePercentage1: "",
      dcaRebuyPercentage1: "",
    },
  });

  /**
   * Determine the current position status.
   *
   * @returns {PositionsCollectionType} Position type.
   */
  const getPositionStatusType = () => {
    if (positionEntity.closed && positionEntity.type === "closed") {
      return "closed";
    } else if (positionEntity.closed && positionEntity.type === "log") {
      return "log";
    }

    return "open";
  };

  /**
   * Propagate position change when affect the edit panels read-only mode.
   *
   * @param {UserPositionsCollection} positionsList Positions fetch interval notification.
   * @returns {Void} None.
   */
  const processPositionsUpdate = (positionsList) => {
    if (isArray(positionsList)) {
      const newPositionEntity = positionsList[0];
      const compareFields = [
        "updating",
        "closed",
        "status",
        "reBuyTargets",
        "positionSizeQuote",
        "reduceOrders",
        // "sellPrice",
      ];
      const propagateChange = !isEqual(
        pick(positionEntity, compareFields),
        pick(newPositionEntity, compareFields),
      );

      if (propagateChange) {
        setPositionEntity(newPositionEntity);
      }

      methods.setValue("priceDifference", newPositionEntity.priceDifference);
    }
  };

  const recoverPositionAsSupportUser = () => {
    setRecoverPositionLoading(true);
    const payload = {
      token: storeSession.tradeApi.accessToken,
      internalExchangeId: storeSettings.selectedExchange.internalId,
      positionId: positionId,
    };

    tradeApi
      .recoverPosition(payload)
      .then(() => {
        dispatch(showSuccessAlert("", "request submitted to recover position"));
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setRecoverPositionLoading(false);
      });
  };

  return (
    <TradingViewContext.Provider value={tradingViewContext}>
      <FormProvider {...methods}>
        <Box className="tradingTerminal" display="flex" flexDirection="column" width={1}>
          {!isLoading && (
            <PositionsTable
              notifyPositionsUpdate={processPositionsUpdate}
              positionEntity={positionEntity}
              type={getPositionStatusType()}
            />
          )}
          <Box
            bgcolor="grid.content"
            className="tradingViewContainer"
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            width={1}
          >
            {isLoading && (
              <Box
                className="loadProgress"
                display="flex"
                flexDirection="row"
                justifyContent="center"
              >
                <CircularProgress disableShrink />
              </Box>
            )}
            <Box className="tradingViewChart" id="trading_view_chart" />
            {!isLoading && lastPrice && (
              <StrategyForm
                lastPrice={lastPrice}
                notifyPositionUpdate={notifyPositionUpdate}
                positionEntity={positionEntity}
                selectedSymbol={selectedSymbol}
                tradingViewWidget={tradingViewWidget}
              />
            )}
          </Box>
          {storeUserData && storeUserData.isAdmin && positionId && (
            <Box marginTop={2} maxWidth="300px" minWidth="300px">
              <CustomButton
                className="submitButton"
                loading={recoverPositionLoading}
                onClick={recoverPositionAsSupportUser}
              >
                Recover Position
              </CustomButton>
            </Box>
          )}
          {positionRawData && (
            <Box alignItems="center" display="flex" flexDirection="column" mt="24px">
              <Typography variant="h6">Debug</Typography>
              <pre>{JSON.stringify(positionRawData, null, 2)}</pre>
            </Box>
          )}
        </Box>
      </FormProvider>
    </TradingViewContext.Provider>
  );
};

export default React.memo(TradingViewEdit);
