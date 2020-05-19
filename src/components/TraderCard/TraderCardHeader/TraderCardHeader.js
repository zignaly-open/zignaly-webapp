import React from "react";
import PropTypes from "prop-types";
import "./TraderCardHeader.scss";
import { Box, Typography } from "@material-ui/core";
import ConnectedIcon from "../../../images/dashboard/connected.svg";
import LogoIcon from "../../../images/logo/logoIcon.svg";
import { FormattedMessage } from "react-intl";

/**
 * @typedef {Object} TraderCardHeaderPropTypes
 * @property {number} fee Comission fee in %
 * @property {string} name Provider's name
 * @property {string} logoUrl Url of the provider's logo
 * @property {string} coin Coin trader by provider
 */

/**
 * Provides a header for a trader card.
 *
 * @param {TraderCardHeaderPropTypes} props Component properties.
 * @returns {Object} Component JSX.
 */
const TraderCardHeader = (props) => {
  const { fee, name, logoUrl, coin } = props;
  return (
    <Box alignItems="center" className="traderCardHeader" display="flex" flexDirection="row">
      <img alt={name} className="logoIcon" src={logoUrl || LogoIcon} />
      <Box
        alignItems="center"
        className="traderCardHeaderTitleBox"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Box
          className="nameBox"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Box
            alignItems="flex-start"
            display="flex"
            flexDirection="row"
            justifyContent="flex-start"
          >
            <Typography className="name" variant="h4">
              {name}
            </Typography>
            <img alt="zignaly" className="connectedIcon" src={ConnectedIcon} />
          </Box>
          <Typography className="tradeType" variant="caption">
            Trades {coin}
          </Typography>
        </Box>
        <Box
          alignItems="flex-end"
          className="commissionBox"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Typography variant="h4">{fee}</Typography>
          <Typography variant="subtitle1">
            <FormattedMessage id="srv.comision" />
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

TraderCardHeader.propTypes = {
  name: PropTypes.string.isRequired,
  coin: PropTypes.string.isRequired,
  fee: PropTypes.number.isRequired,
  logoUrl: PropTypes.string.isRequired,
};

export default TraderCardHeader;
