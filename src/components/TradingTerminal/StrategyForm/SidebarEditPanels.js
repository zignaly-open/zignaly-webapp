import React from "react";
import TakeProfitPanel from "../TakeProfitPanel/TakeProfitPanel";
import DCAPanel from "../DCAPanel/DCAPanel";
import StopLossPanel from "../StopLossPanel/StopLossPanel";
import TrailingStopPanel from "../TrailingStopPanel/TrailingStopPanel";
import IncreaseStrategyPanel from "../IncreaseStrategyPanel/IncreaseStrategyPanel";
import ReduceOrders from "../ReduceOrders/ReduceOrders";
import ReduceStrategyPanel from "../ReduceStrategyPanel/ReduceStrategyPanel";

/**
 * @typedef {import("../../../services/tradeApiClient.types").PositionEntity} PositionEntity
 * @typedef {import("../../../services/tradeApiClient.types").MarketSymbol} MarketSymbol
 */

/**
 * @typedef {Object} SidebarEditPanelsProps
 * @property {MarketSymbol} selectedSymbol
 * @property {PositionEntity} [positionEntity] Position entity (optional) for position edit trading view.
 * @property {boolean} isReadOnly Flag to disable position update.
 */

/**
 * Edit position sidebar edit panels.
 *
 * @param {SidebarEditPanelsProps} props Component props.
 * @returns {JSX.Element} Strategy form element.
 */
const SidebarEditPanels = (props) => {
  const { positionEntity, selectedSymbol, isReadOnly } = props;

  return (
    <>
      {/* <TakeProfitPanel
        isReadOnly={isReadOnly}
        positionEntity={positionEntity}
        symbolData={selectedSymbol}
      />
      <DCAPanel
        isReadOnly={isReadOnly}
        positionEntity={positionEntity}
        symbolData={selectedSymbol}
      /> */}
      <StopLossPanel
        isReadOnly={isReadOnly}
        positionEntity={positionEntity}
        symbolData={selectedSymbol}
      />
      {/* <TrailingStopPanel
        isReadOnly={isReadOnly}
        positionEntity={positionEntity}
        symbolData={selectedSymbol}
      />
      {!isReadOnly && (
        <IncreaseStrategyPanel positionEntity={positionEntity} symbolData={selectedSymbol} />
      )}
      <ReduceOrders isReadOnly={isReadOnly} positionEntity={positionEntity} />
      {!isReadOnly && (
        <ReduceStrategyPanel positionEntity={positionEntity} symbolData={selectedSymbol} />
      )} */}
    </>
  );
};

export default React.memo(SidebarEditPanels);
