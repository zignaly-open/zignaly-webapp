import React from "react";
import "./TraderCardHeader.scss";
import { Box, Typography } from "@material-ui/core";
import ConnectedIcon from "../../../images/dashboard/connected.svg";
import LogoIcon from "../../../images/logo/logoIcon.svg";
import ExchangeIcon from "../../ExchangeIcon";
import { FormattedMessage } from "react-intl";

/**
 * @typedef {import("../../../services/tradeApiClient.types").ProviderEntity} Provider
 *
 * @typedef {Object} TraderCardHeaderPropTypes
 * @property {Provider} provider The provider to display.
 */

/**
 * Provides a header for a trader card.
 *
 * @param {TraderCardHeaderPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const TraderCardHeader = (props) => {
  const { fee, name, logoUrl, coin, exchanges, disable } = props.provider;
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
            {!disable && <img alt="zignaly" className="connectedIcon" src={ConnectedIcon} />}
          </Box>
          <Box alignItems="center" display="flex" flexDirection="row">
            <Typography className="tradeType" variant="caption">
              Trades {coin} on
            </Typography>
            {exchanges.map((exchange, index) => (
              <ExchangeIcon exchange={exchange} key={index} />
            ))}
          </Box>
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

export default TraderCardHeader;
