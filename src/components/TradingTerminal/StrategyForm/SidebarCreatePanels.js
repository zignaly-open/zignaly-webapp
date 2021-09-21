import React from "react";
import TakeProfitPanel from "../TakeProfitPanel/TakeProfitPanel";
import DCAPanel from "../DCAPanel/DCAPanel";
import StopLossPanel from "../StopLossPanel/StopLossPanel";
import TrailingStopPanel from "../TrailingStopPanel/TrailingStopPanel";
import StrategyPanel from "../StrategyPanel/StrategyPanel";
import EntryExpirationPanel from "../EntryExpirationPanel/EntryExpirationPanel";
import AutoclosePanel from "../AutoclosePanel/AutoclosePanel";

/**
 * @typedef {import("../../../services/tradeApiClient.types").MarketSymbol} MarketSymbol
 */

/**
 * @typedef {Object} SidebarCreatePanelsProps
 * @property {MarketSymbol} selectedSymbol
 */

/**
 * Edit position sidebar edit panels.
 *
 * @param {SidebarCreatePanelsProps} props Component props.
 * @returns {JSX.Element} Strategy form element.
 */
const SidebarCreatePanels = (props) => {
  const { selectedSymbol } = props;

  return (
    <>
      <StrategyPanel symbolData={selectedSymbol} />
      <TakeProfitPanel symbolData={selectedSymbol} />
      <DCAPanel symbolData={selectedSymbol} />
      <StopLossPanel symbolData={selectedSymbol} />
      <TrailingStopPanel symbolData={selectedSymbol} />
      <EntryExpirationPanel />
      <AutoclosePanel />
    </>
  );
};

export default React.memo(SidebarCreatePanels);
