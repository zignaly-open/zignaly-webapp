import React from "react";
import "./TraderCardHeader.scss";
import { Typography } from "@material-ui/core";
import VerifiedIcon from "components/Provider/VerifiedIcon";
import ExchangeIcon from "../../ExchangeIcon";
import { FormattedMessage } from "react-intl";
import ProviderLogo from "../../Provider/ProviderHeader/ProviderLogo";
import { Link } from "gatsby";

/**
 * @typedef {import("../../../services/tradeApiClient.types").ProviderEntity} Provider
 * @typedef {import("../../../services/tradeApiClient.types").NewAPIProvidersPayload} NewAPIProvidersPayload
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
const TraderCardHeader = ({ provider }) => {
  const {
    price,
    name,
    logoUrl,
    quote,
    exchanges,
    exchangeType,
    profitsShare,
    profitSharing,
    providerLink,
    verified,
  } = provider;

  return (
    <div className="traderCardHeader">
      <ProviderLogo size="40px" title={name} url={logoUrl} />
      <div className="traderCardHeaderTitleBox">
        <div className="nameBox">
          <Link className="name" to={providerLink}>
            <Typography variant="h4">
              {name}
              {verified && <VerifiedIcon />}
            </Typography>
          </Link>
          {/* {!disable && <img alt="zignaly" className="connectedIcon" src={ConnectedIcon} />} */}
          {profitSharing ? (
            <div className="commissionBox successFeeBox">
              <Typography variant="h4">{`${profitsShare}%`}</Typography>
              <Typography className="price" variant="subtitle1">
                <FormattedMessage id="copyt.successfee" />
              </Typography>
            </div>
          ) : (
            <div className="commissionBox">
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
              <Typography className="price" variant="subtitle1">
                <FormattedMessage id="srv.edit.price" />
              </Typography>
            </div>
          )}
        </div>
        {/* <Box
          className="nameBox"
          display="flex"
          flexDirection="column"

        > */}
        <div className="tradesInfoBox">
          <Typography className="tradeType" variant="caption">
            <FormattedMessage
              id="srv.trades"
              values={{
                coin: <b>{quote}</b> || "",
                type: <b>{exchangeType}</b>,
              }}
            />
          </Typography>
          {exchanges.map((exchange, index) => (
            <ExchangeIcon exchange={exchange} key={index} size="xsmall" />
          ))}
          {/* </Box> */}
        </div>

        {/* <CustomToolip
          title={<FormattedMessage id="srv.comission.tooltip" values={{ comission: price || 0 }} />}
        > */}

        {/* </CustomToolip> */}
      </div>
    </div>
  );
};

export default TraderCardHeader;
