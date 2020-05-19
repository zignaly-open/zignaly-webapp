import React from "react";
import "./TraderCard.scss";
import { Box } from "@material-ui/core";
import TraderCardHeader from "./TraderCardHeader";
import TraderCardBody from "./TraderCardBody";
import PropTypes from "prop-types";

/**
 * @typedef {Object} TraderCardPropTypes
 * @property {number} fee Comission fee in %
 * @property {string} name Provider's name
 * @property {string} logoUrl Url of the provider's logo
 * @property {string} coin Coin trader by provider
 * @property {boolean} showSummary Flag to indicate if summary should be rendered.
 * @property {number} risk Return for open positions.
 * @property {number} returns Return for closed positions on the selected period.
 * @property {string} id Provider id.
 */

/**
 * Provides a card with trader's information and stats
 *
 * @param {TraderCardPropTypes} props Component properties.
 * @returns {Object} Component JSX.
 */
const TraderCard = (props) => {
  const { id, risk, returns, showSummary, fee, name, logoUrl, coin } = props;

  return (
    <Box
      bgcolor="grid.main"
      className="traderCard"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      <TraderCardHeader coin={coin} fee={fee} logoUrl={logoUrl} name={name} />
      <TraderCardBody id={id} returns={returns} risk={risk} showSummary={showSummary} />
    </Box>
  );
};

TraderCard.propTypes = {
  name: PropTypes.string.isRequired,
  coin: PropTypes.string.isRequired,
  fee: PropTypes.number.isRequired,
  logoUrl: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  showSummary: PropTypes.bool.isRequired,
  risk: PropTypes.number.isRequired,
  returns: PropTypes.number.isRequired,
};

export default TraderCard;
