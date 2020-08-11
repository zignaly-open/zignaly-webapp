import React, { useEffect, useState } from "react";
import { isArray, isEqual, isNumber, pick } from "lodash";
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
import { useStoreUserData } from "../../../hooks/useStoreUserSelector";
import { formatPrice } from "../../../utils/formatters";
import "./TradingView.scss";

/**
 * @typedef {any} TVWidget
 * @typedef {import("../../../services/tradeApiClient.types").PositionEntity} PositionEntity
 * @typedef {import("../../../services/tradeApiClient.types").UserPositionsCollection} UserPositionsCollection
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
  const [tradingViewWidget, setTradingViewWidget] = useState(
    /** @type {TVWidget} tradingViewWidgetPointer */ null,
  );
  const [lastPrice, setLastPrice] = useState(null);
  const [positionEntity, setPositionEntity] = useState(/** @type {PositionEntity} */ (null));
  // Raw position entity (for debug)
  const [positionRawData, setPositionRawData] = useState(/** @type {*} */ (null));
  const [marketData, setMarketData] = useState(null);
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const storeSession = useStoreSessionSelector();
  const storeSettings = useStoreSettingsSelector();
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

  const getMarketData = async () => {
    const marketDataPayload = {
      token: storeSession.tradeApi.accessToken,
      exchangeInternalId: storeSettings.selectedExchange.internalId,
    };

    try {
      const data = await tradeApi.exchangeConnectionMarketDataGet(marketDataPayload);
      setMarketData(data);
    } catch (e) {
      dispatch(showErrorAlert(e));
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
    getMarketData();
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
   * Callback that to be notified when position updates are peformed.
   *
   * @returns {Void} None.
   */
  const notifyPositionUpdate = () => {
    fetchPosition();
  };

  const isLoading = tradingViewWidget === null || !positionEntity || !libraryReady || !marketData;

  /**
   * Resolve exchange name from selected exchange.
   *
   * @returns {string} Exchange name.
   */
  const resolveExchangeName = () => {
    return storeSettings.selectedExchange.exchangeName || storeSettings.selectedExchange.name;
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

    // @ts-ignore
    // eslint-disable-next-line new-cap
    const externalWidget = new window.TradingView.widget(widgetOptions);
    let eventSymbol = "";
    // @ts-ignore
    const handleWidgetReady = (event) => {
      const dataRaw = /** @type {Object<string, any>} */ event.data;
      if (typeof dataRaw === "string") {
        try {
          const dataParsed = JSON.parse(dataRaw);

          // @ts-ignore
          if (dataParsed.name === "widgetReady" && externalWidget.postMessage) {
            setTradingViewWidget(externalWidget);
          }

          if (dataParsed.name === "quoteUpdate" && dataParsed.data) {
            if (eventSymbol !== dataParsed.data.original_name) {
              const receivedPrice = isNumber(dataParsed.data.last_price)
                ? formatPrice(dataParsed.data.last_price, "", "")
                : dataParsed.data.last_price;
              setLastPrice(receivedPrice);
              eventSymbol = dataParsed.data.original_name;
            }
          }
        } catch (e) {
          // Not a valid JSON, skip event.
          return;
        }
      }
    };

    window.addEventListener("message", handleWidgetReady);

    return () => {
      if (tradingViewWidget) {
        tradingViewWidget.remove();
        setTradingViewWidget(null);
        window.removeEventListener("message", handleWidgetReady);
      }
    };
  };

  // Create Trading View widget when TV external library is ready.
  useEffect(bootstrapWidget, [libraryReady, positionEntity, tradingViewWidget]);

  // Force initial price notification.
  const initDataFeedSymbol = () => {
    const symbolSuffix =
      storeSettings.selectedExchange.exchangeType.toLocaleLowerCase() === "futures" ? "PERP" : "";
    const symbolCode = selectedSymbol.replace("/", "") + symbolSuffix;
    const exchangeId = mapExchangeConnectionToTradingViewId(resolveExchangeName());

    const checkExist = setInterval(() => {
      if (tradingViewWidget && tradingViewWidget.iframe && tradingViewWidget.iframe.contentWindow) {
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
    },
  });

  /**
   * Determine the current position status.
   *
   * @returns {PositionsCollectionType} Position type.
   */
  const getPositionStatusType = () => {
    if (positionEntity.closed && positionEntity.accounting) {
      return "closed";
    } else if (positionEntity.closed && !positionEntity.accounting) {
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
      const compareFields = ["updating", "closed", "status", "reBuyTargets", "positionSizeQuote"];
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
            <StrategyForm
              lastPrice={lastPrice}
              notifyPositionUpdate={notifyPositionUpdate}
              positionEntity={positionEntity}
              selectedSymbol={selectedSymbol}
              symbolsData={marketData}
              tradingViewWidget={tradingViewWidget}
            />
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
