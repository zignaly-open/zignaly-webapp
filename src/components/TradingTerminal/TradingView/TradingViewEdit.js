import React, { useEffect, useState } from "react";
import { FormContext, useForm } from "react-hook-form";
import { widget as TradingViewWidget } from "../../../tradingView/charting_library.min";
import { createWidgetOptions } from "../../../tradingView/dataFeedOptions";
import tradeApi from "../../../services/tradeApiClient";
import StrategyForm from "../StrategyForm/StrategyForm";
import { Box, CircularProgress } from "@material-ui/core";
import PositionsTable from "../../Dashboard/PositionsTable/PositionsTable";
import useCoinRayDataFeedFactory from "../../../hooks/useCoinRayDataFeedFactory";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../../../store/actions/ui";
import "./TradingView.scss";

/**
 * @typedef {import("../../../tradingView/charting_library.min").IChartingLibraryWidget} TVWidget
 * @typedef {import("../../../services/tradeApiClient.types").PositionEntity} PositionEntity
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
  const [tradingViewWidget, setTradingViewWidget] = useState(
    /** @type {TVWidget} tradingViewWidgetPointer */ null,
  );
  const [lastPrice, setLastPrice] = useState(null);
  const [positionEntity, setPositionEntity] = useState(/** @type {PositionEntity} */ (null));
  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();

  /**
   * Initialize state variables that depend on loaded position.
   *
   * @param {PositionEntity} responseData Position entity retrieved from Trade API response.
   * @returns {Void} None.
   */
  const initializePosition = (responseData) => {
    setPositionEntity(responseData);
    setSelectedSymbol(responseData.pair);
  };

  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const dataFeed = useCoinRayDataFeedFactory(selectedSymbol);

  /**
   * Fetch a position on position edit mode.
   *
   * @returns {Void} None.
   */
  const fetchPosition = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      positionId,
    };

    tradeApi
      .positionGet(payload)
      .then((data) => {
        initializePosition(data);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };

  useEffect(fetchPosition, []);

  /**
   * Callback that to be notified when position updates are peformed.
   *
   * @returns {Void} None.
   */
  const notifyPositionUpdate = () => {
    fetchPosition();
  };

  const isLoading = tradingViewWidget === null || !positionEntity;
  const isLastPriceLoading = lastPrice === null;

  const bootstrapWidget = () => {
    if (dataFeed) {
      const widgetOptions = createWidgetOptions(dataFeed, selectedSymbol);
      const widgetInstance = new TradingViewWidget(widgetOptions);
      // Store to state only when chart is ready so prices are resolved.
      widgetInstance.onChartReady(() => {
        setTradingViewWidget(widgetInstance);
        // @ts-ignore
        const priceCandle = dataFeed.getLastCandle();
        setLastPrice(priceCandle);
      });
    }

    return () => {
      if (tradingViewWidget) {
        tradingViewWidget.remove();
        setTradingViewWidget(null);
      }
    };
  };

  // Create Trading View widget when data feed token is ready.
  useEffect(bootstrapWidget, [dataFeed]);

  const currentPrice = lastPrice ? parseFloat(lastPrice[1]).toFixed(8) : "";
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      entryType: "LONG",
      leverage: 1,
      positionSize: "",
      price: currentPrice,
      realInvestment: "",
      stopLossPrice: "",
      trailingStopPrice: "",
      units: "",
      dcaTargetPricePercentage1: "",
    },
  });

  return (
    <FormContext {...methods}>
      <Box className="tradingTerminal" display="flex" flexDirection="column" width={1}>
        {!isLoading && <PositionsTable positionEntity={positionEntity} type="open" />}
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
          {!isLoading && !isLastPriceLoading && (
            <StrategyForm
              dataFeed={dataFeed}
              lastPriceCandle={lastPrice}
              notifyPositionUpdate={notifyPositionUpdate}
              positionEntity={positionEntity}
              selectedSymbol={selectedSymbol}
              tradingViewWidget={tradingViewWidget}
            />
          )}
        </Box>
      </Box>
    </FormContext>
  );
};

export default React.memo(TradingViewEdit);
