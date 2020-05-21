import React from "react";
import "./TraderCard.scss";
import { Box } from "@material-ui/core";
import TraderCardHeader from "./TraderCardHeader";
import TraderCardBody from "./TraderCardBody";

/**
 * @typedef {import("../../services/tradeApiClient.types").DailyReturn} DailyReturn
 *
 * @typedef {Object} TraderCardPropTypes
 * @property {any} fee Comission fee in %
 * @property {string} name Provider's name
 * @property {string} logoUrl Url of the provider's logo
 * @property {string} coin Coin traded by provider
 * @property {boolean} showSummary Flag to indicate if summary should be rendered.
 * @property {number} risk Return for open positions.
 * @property {Array<DailyReturn>} dailyReturns Return for closed positions on the selected period.
 * @property {string} id Provider id.
 * @property {Array<string>} exchanges Exchanges supported by provider
 * @property {boolean} isCopyTrading Flag to indicate if the provider is copy trading.
 */

/**
 * Provides a card with trader's information and stats
 *
 * @param {TraderCardPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const TraderCard = (props) => {
  const {
    id,
    risk,
    dailyReturns,
    showSummary,
    fee,
    name,
    logoUrl,
    coin,
    exchanges,
    isCopyTrading,
  } = props;

  return (
    <Box
      bgcolor="grid.main"
      className="traderCard"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      <TraderCardHeader coin={coin} exchanges={exchanges} fee={fee} logoUrl={logoUrl} name={name} />
      <TraderCardBody
        dailyReturns={dailyReturns}
        id={id}
        isCopyTrading={isCopyTrading}
        risk={risk}
        showSummary={showSummary}
      />
    </Box>
  );
};

export default TraderCard;
