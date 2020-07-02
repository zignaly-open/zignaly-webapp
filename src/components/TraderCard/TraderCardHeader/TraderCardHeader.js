import React from "react";
import "./TraderCardHeader.scss";
import { Box, Typography } from "@material-ui/core";
import ExchangeIcon from "../../ExchangeIcon";
import { FormattedMessage } from "react-intl";
import ProviderLogo from "../../Provider/ProviderHeader/ProviderLogo";
import { Link } from "gatsby";

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
  const {
    price,
    name,
    logoUrl,
    quote,
    exchanges,
    isCopyTrading,
    id,
    exchangeType,
  } = props.provider;

  const profileLink = `/${isCopyTrading ? "copyTraders" : "signalProviders"}/${id}/profile`;

  return (
    <Box alignItems="center" className="traderCardHeader" display="flex" flexDirection="row">
      <ProviderLogo size="40px" title={name} url={logoUrl} />
      <Box
        alignItems="flex-start"
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
            className="nameWrapper"
            display="flex"
            flexDirection="row"
            justifyContent="flex-start"
          >
            <Link className="name" to={profileLink}>
              <Typography variant="h4">{name}</Typography>
            </Link>
            {/* {!disable && <img alt="zignaly" className="connectedIcon" src={ConnectedIcon} />} */}
          </Box>
          <Box alignItems="center" display="flex" flexDirection="row">
            <Typography className="tradeType" variant="caption">
              <FormattedMessage
                id="srv.trades"
                values={{
                  coin: quote || "",
                  type: exchangeType,
                }}
              />
            </Typography>
            {exchanges.map((exchange, index) => (
              <ExchangeIcon exchange={exchange} key={index} size="xsmall" />
            ))}
          </Box>
        </Box>

        {/* <CustomToolip
          title={<FormattedMessage id="srv.comission.tooltip" values={{ comission: price || 0 }} />}
        > */}
        <Box alignItems="flex-end" className="commissionBox" display="flex" flexDirection="column">
          <Typography variant="h4">
            {price ? (
              <span>
                {price}
                <FormattedMessage id="srv.pricemonth" />
              </span>
            ) : (
              <FormattedMessage id="col.free" />
            )}
          </Typography>
          <Typography variant="subtitle1">
            <FormattedMessage id="srv.edit.price" />
          </Typography>
        </Box>
        {/* </CustomToolip> */}
      </Box>
    </Box>
  );
};

export default TraderCardHeader;
