import React, { useEffect, useState } from "react";
import { isArray, isEqual, pick, assign } from "lodash";
import { FormProvider, useForm } from "react-hook-form";
import {
  createWidgetOptions,
  mapExchangeConnectionToTradingViewId,
} from "../../../tradingView/dataFeedOptions";
import tradeApi from "../../../services/tradeApiClient";
import StrategyForm from "../StrategyForm/StrategyForm";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import PositionsTable from "../../Dashboard/PositionsTable/PositionsTable";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../../../store/actions/ui";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import {
  useStoreUserData,
  useStoreUserExchangeConnections,
} from "../../../hooks/useStoreUserSelector";
import useTradingTerminal from "../../../hooks/useTradingTerminal";
import "./TradingView.scss";
import {
  createExchangeConnectionEmptyEntity,
  createMarketSymbolEmptyValueObject,
} from "../../../services/tradeApiClient.types";

/**
 * @typedef {any} TVWidget
 * @typedef {import("../../../services/tradeApiClient.types").PositionEntity} PositionEntity
 * @typedef {import("../../../services/tradeApiClient.types").UserPositionsCollection} UserPositionsCollection
 * @typedef {import("../../../services/tradeApiClient.types").MarketSymbolsCollection} MarketSymbolsCollection
 * @typedef {import("../../../services/tradeApiClient.types").DefaultProviderGetObject} ProviderEntity
 * @typedef {import("../../../hooks/usePositionsList").PositionsCollectionType} PositionsCollectionType
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
  const [libraryReady, setLibraryReady] = useState(false);
  const { instantiateWidget, lastPrice, tradingViewWidget } = useTradingTerminal();
  const [positionEntity, setPositionEntity] = useState(/** @type {PositionEntity} */ (null));
  // Raw position entity (for debug)
  const [positionRawData, setPositionRawData] = useState(/** @type {*} */ (null));
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [symbols, setSymbols] = useState(/** @type {MarketSymbolsCollection} */ (null));
  let symbolData = symbols ? symbols.find((d) => d.short === selectedSymbol) : null;
  if (positionEntity && !symbolData) {
    symbolData = assign(createMarketSymbolEmptyValueObject(), {
      id: positionEntity.symbol,
      base: positionEntity.base,
      baseId: positionEntity.base,
      quote: positionEntity.quote,
      quoteId: positionEntity.quote,
      short: positionEntity.short,
      tradeViewSymbol: positionEntity.tradeViewSymbol,
      limits: {},
    });
  }
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
    setSelectedSymbol(responseData.symbol);
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

    // When position is closed avoid get market data and rely on position symbol data.
    if (!positionData.closed) {
      tradeApi
        .exchangeConnectionMarketDataGet(marketDataPayload)
        .then((data) => {
          setSymbols(data);
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        });
    }
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

  const loadDependencies = () => {
    fetchPosition();
    const checkExist = setInterval(() => {
      // @ts-ignore
      if (window.TradingView && window.TradingView.widget) {
        setLibraryReady(true);
        clearInterval(checkExist);
      }
    }, 100);
  };
  useEffect(loadDependencies, []);

  /**
   * Callback that to be notified when position updates are performed.
   *
   * @returns {Void} None.
   */
  const notifyPositionUpdate = () => {
    fetchPosition();
    methods.setValue("updatedAt", new Date());
  };

  const isLoading = tradingViewWidget === null || !positionEntity || !libraryReady || !symbolData;

  /**
   * Resolve exchange name from selected exchange.
   *
   * @returns {string} Exchange name.
   */
  const resolveExchangeName = () => {
    return exchange.exchangeName || exchange.name;
  };

  const bootstrapWidget = () => {
    // Skip if TV widget already exists or TV library is not ready.
    if (!libraryReady || !positionEntity || tradingViewWidget) {
      return () => {};
    }

    const widgetOptions = createWidgetOptions(
      resolveExchangeName(),
      selectedSymbol,
      storeSettings.darkStyle,
    );

    const cleanupWidget = instantiateWidget(widgetOptions);
    return () => {
      cleanupWidget();
    };
  };

  // Create Trading View widget when TV external library is ready.
  useEffect(bootstrapWidget, [libraryReady, positionEntity, tradingViewWidget]);

  // Force initial price notification.
  const initDataFeedSymbol = () => {
    const checkExist = setInterval(() => {
      if (
        tradingViewWidget &&
        tradingViewWidget.iframe &&
        tradingViewWidget.iframe.contentWindow &&
        symbolData
      ) {
        const symbolSuffix =
          storeSettings.selectedExchange.exchangeName.toLowerCase() !== "bitmex" &&
          storeSettings.selectedExchange.exchangeType === "futures"
            ? "PERP"
            : "";
        const symbolCode = symbolData.tradeViewSymbol + symbolSuffix;
        const exchangeId = mapExchangeConnectionToTradingViewId(resolveExchangeName());

        tradingViewWidget.iframe.contentWindow.postMessage(
          { name: "set-symbol", data: { symbol: `${exchangeId}:${symbolCode}` } },
          "*",
        );
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

  return (
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
            <>
              <input name="updatedAt" ref={methods.register} type="hidden" />
              <StrategyForm
                lastPrice={lastPrice}
                notifyPositionUpdate={notifyPositionUpdate}
                positionEntity={positionEntity}
                selectedSymbol={symbolData}
                tradingViewWidget={tradingViewWidget}
              />
            </>
          )}
        </Box>
        {positionRawData && (
          <Box alignItems="center" display="flex" flexDirection="column" mt="24px">
            <Typography variant="h6">Debug</Typography>
            <pre>{JSON.stringify(positionRawData, null, 2)}</pre>
          </Box>
        )}
      </Box>
    </FormProvider>
  );
};

export default React.memo(TradingViewEdit);
