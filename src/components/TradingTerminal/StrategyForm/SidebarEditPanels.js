import React from "react";
import TakeProfitPanel from "../TakeProfitPanel/TakeProfitPanel";
import DCAPanel from "../DCAPanel/DCAPanel";
import StopLossPanel from "../StopLossPanel/StopLossPanel";
import TrailingStopPanel from "../TrailingStopPanel/TrailingStopPanel";
import IncreaseStrategyPanel from "../IncreaseStrategyPanel/IncreaseStrategyPanel";

/**
 * @typedef {import("../../../services/tradeApiClient.types").PositionEntity} PositionEntity
 * @typedef {import("../../../services/tradeApiClient.types").MarketSymbol} MarketSymbol
 */

/**
 * @typedef {Object} SidebarEditPanelsProps
 * @property {MarketSymbol} currentSymbolData
 * @property {PositionEntity} [positionEntity] Position entity (optional) for position edit trading view.
 */

/**
 * Edit position sidebar edit panels.
 *
 * @param {SidebarEditPanelsProps} props Component props.
 * @returns {JSX.Element} Strategy form element.
 */
const SidebarEditPanels = (props) => {
  const { positionEntity, currentSymbolData } = props;
  console.log("positionEntityUpdate: ", positionEntity);

  const isClosed = positionEntity ? positionEntity.closed : false;
  const isCopy = positionEntity ? positionEntity.isCopyTrading : false;
  const isCopyTrader = positionEntity ? positionEntity.isCopyTrader : false;
  const isUpdating = positionEntity ? positionEntity.updating : false;
  const isOpening = positionEntity ? positionEntity.status === 1 : false;
  const isReadOnly = (isCopy && !isCopyTrader) || isClosed || isUpdating || isOpening;

  return (
    <>
      <TakeProfitPanel positionEntity={positionEntity} symbolData={currentSymbolData} />
      <DCAPanel positionEntity={positionEntity} symbolData={currentSymbolData} />
      <StopLossPanel positionEntity={positionEntity} symbolData={currentSymbolData} />
      <TrailingStopPanel positionEntity={positionEntity} symbolData={currentSymbolData} />
      {!isReadOnly && (
        <IncreaseStrategyPanel positionEntity={positionEntity} symbolData={currentSymbolData} />
      )}
    </>
  );
};

export default React.memo(SidebarEditPanels);
