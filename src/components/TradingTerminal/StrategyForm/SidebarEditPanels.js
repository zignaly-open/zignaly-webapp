import React from "react";
import TakeProfitPanel from "../TakeProfitPanel/TakeProfitPanel";
import DCAPanel from "../DCAPanel/DCAPanel";
import StopLossPanel from "../StopLossPanel/StopLossPanel";
import TrailingStopPanel from "../TrailingStopPanel/TrailingStopPanel";
import IncreaseStrategyPanel from "../IncreaseStrategyPanel/IncreaseStrategyPanel";
import ReduceStrategyPanel from "../ReduceStrategyPanel/ReduceStrategyPanel";

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

  return (
    <>
      <TakeProfitPanel positionEntity={positionEntity} symbolData={currentSymbolData} />
      <DCAPanel positionEntity={positionEntity} symbolData={currentSymbolData} />
      <StopLossPanel positionEntity={positionEntity} symbolData={currentSymbolData} />
      <TrailingStopPanel positionEntity={positionEntity} symbolData={currentSymbolData} />
      <IncreaseStrategyPanel positionEntity={positionEntity} symbolData={currentSymbolData} />
      <ReduceStrategyPanel positionEntity={positionEntity} symbolData={currentSymbolData} />
    </>
  );
};

export default React.memo(SidebarEditPanels);
