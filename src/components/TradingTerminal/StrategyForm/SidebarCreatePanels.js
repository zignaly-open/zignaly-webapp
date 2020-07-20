import React from "react";
import TakeProfitPanel from "../TakeProfitPanel/TakeProfitPanel";
import DCAPanel from "../DCAPanel/DCAPanel";
import StopLossPanel from "../StopLossPanel/StopLossPanel";
import TrailingStopPanel from "../TrailingStopPanel/TrailingStopPanel";
import StrategyPanel from "../StrategyPanel/StrategyPanel";
import EntryExpirationPanel from "../EntryExpirationPanel/EntryExpirationPanel";
import AutoclosePanel from "../AutoclosePanel/AutoclosePanel";

/**
 * @typedef {import("../../../services/tradeApiClient.types").PositionEntity} PositionEntity
 * @typedef {import("../../../services/tradeApiClient.types").MarketSymbol} MarketSymbol
 */

/**
 * @typedef {Object} SidebarCreatePanelsProps
 * @property {MarketSymbol} currentSymbolData
 */

/**
 * Edit position sidebar edit panels.
 *
 * @param {SidebarCreatePanelsProps} props Component props.
 * @returns {JSX.Element} Strategy form element.
 */
const SidebarCreatePanels = (props) => {
  const { currentSymbolData } = props;

  return (
    <>
      <StrategyPanel symbolData={currentSymbolData} />
      <DCAPanel symbolData={currentSymbolData} />
    </>
  );
};

export default React.memo(SidebarCreatePanels);
