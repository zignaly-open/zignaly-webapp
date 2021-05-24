import React from "react";
import "./TraderCard.scss";
import TraderCardHeader from "./TraderCardHeader";
import TraderCardBody from "./TraderCardBody";

/**
 * @typedef {import("../../services/tradeApiClient.types").ProviderEntity} Provider
 * @typedef {import("../../services/tradeApiClient.types").DailyReturn} DailyReturn
 * @typedef {import("../../services/tradeApiClient.types").NewAPIProvidersPayload} NewAPIProvidersPayload
 *
 *
 * @typedef {Object} TraderCardPropTypes
 * @property {boolean} showSummary Flag to indicate if summary should be rendered.
 * @property {Provider} provider The provider to display.
 * @property {number} timeFrame Selected timeFrame.
 * @property {Function} reloadProviders reload providers list.
 * @property {NewAPIProvidersPayload["type"]} type provider type
 */

/**
 * Provides a card with trader's information and stats
 *
 * @param {TraderCardPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const TraderCard = (props) => {
  const { provider, showSummary, timeFrame, reloadProviders, type } = props;

  return (
    <div className="traderCard">
      <TraderCardHeader provider={provider} type={type} />
      <TraderCardBody
        provider={provider}
        reloadProviders={reloadProviders}
        showSummary={showSummary}
        timeFrame={timeFrame}
        type={type}
      />
    </div>
  );
};

export default TraderCard;
