import React from "react";
import "./TraderCard.scss";
import { Box } from "@material-ui/core";
import TraderCardHeader from "./TraderCardHeader";
import TraderCardBody from "./TraderCardBody";
import PropTypes from "prop-types";

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
 */

/**
 * Provides a card with trader's information and stats
 *
 * @param {TraderCardPropTypes} props Component properties.
 * @returns {Object} Component JSX.
 */
const TraderCard = (props) => {
  const { id, risk, dailyReturns, showSummary, fee, name, logoUrl, coin, exchanges } = props;

  return (
    <Box
      bgcolor="grid.main"
      className="traderCard"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      <TraderCardHeader coin={coin} fee={fee} logoUrl={logoUrl} name={name} exchanges={exchanges} />
      <TraderCardBody id={id} dailyReturns={dailyReturns} risk={risk} showSummary={showSummary} />
    </Box>
  );
};

TraderCard.propTypes = {
  name: PropTypes.string.isRequired,
  coin: PropTypes.string.isRequired,
  fee: PropTypes.any.isRequired,
  logoUrl: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  showSummary: PropTypes.bool.isRequired,
  risk: PropTypes.number.isRequired,
  dailyReturns: PropTypes.array.isRequired,
  exchanges: PropTypes.array.isRequired,
};

export default TraderCard;
