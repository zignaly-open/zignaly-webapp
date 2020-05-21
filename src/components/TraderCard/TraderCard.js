import React from "react";
import "./TraderCard.scss";
import { Box } from "@material-ui/core";
import TraderCardHeader from "./TraderCardHeader";
import TraderCardBody from "./TraderCardBody";
import PropTypes from "prop-types";

/**
 * @typedef {import("../../services/tradeApiClient.types").ProviderEntity} Provider
 * @typedef {import("../../services/tradeApiClient.types").DailyReturn} DailyReturn
 *
 * @typedef {Object} TraderCardPropTypes
//  * @property {any} fee Comission fee in %
//  * @property {string} name Provider's name
//  * @property {string} logoUrl Url of the provider's logo
//  * @property {string} coin Coin traded by provider
//  * @property {boolean} showSummary Flag to indicate if summary should be rendered.
//  * @property {number} risk Return for open positions.
//  * @property {Array<DailyReturn>} dailyReturns Return for closed positions on the selected period.
//  * @property {string} id Provider id.
//  * @property {Array<string>} exchanges Exchanges supported by provider
//  * @property {boolean} isCopyTrading Flag to indicate if the provider is copy trading.
 * @property {Provider} provider Flag to indicate if the provider is copy trading.
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
      <TraderCardBody
        // dailyReturns={dailyReturns}
        // id={id}
        // isCopyTrading={isCopyTrading}
        // risk={risk}
        provider={provider}
        showSummary={showSummary}
      />
    </Box>
  );
};

TraderCard.propTypes = {
  //   coin: PropTypes.string.isRequired,
  //   dailyReturns: PropTypes.array.isRequired,
  //   exchanges: PropTypes.array.isRequired,
  //   fee: PropTypes.any.isRequired,
  //   id: PropTypes.string.isRequired,
  //   logoUrl: PropTypes.string.isRequired,
  //   name: PropTypes.string.isRequired,
  //   risk: PropTypes.number.isRequired,
  showSummary: PropTypes.bool.isRequired,
  provider: PropTypes.object.isRequired,
};

export default TraderCard;
