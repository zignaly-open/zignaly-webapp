import React from "react";
import "./TraderCard.scss";
import { Box } from "@material-ui/core";
import TraderCardHeader from "./TraderCardHeader";
import TraderCardBody from "./TraderCardBody";

/**
 * @typedef {import("../../services/tradeApiClient.types").ProviderEntity} Provider
 * @typedef {import("../../services/tradeApiClient.types").DailyReturn} DailyReturn
 *
 * @typedef {Object} TraderCardPropTypes
 * @property {boolean} showSummary Flag to indicate if summary should be rendered.
 * @property {Provider} provider The provider to display.
 */

/**
 * Provides a card with trader's information and stats
 *
 * @param {TraderCardPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const TraderCard = (props) => {
  const { provider, showSummary } = props;

  return (
    <Box
      bgcolor="grid.main"
      className="traderCard"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      <TraderCardHeader provider={provider} />
      <TraderCardBody provider={provider} showSummary={showSummary} />
    </Box>
  );
};

export default TraderCard;
