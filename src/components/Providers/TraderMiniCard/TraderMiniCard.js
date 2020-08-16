import React from "react";
import { Box, Typography } from "@material-ui/core";
import LogoIcon from "../../../images/logo/logoIcon.svg";
import "./TraderMiniCard.scss";
import { formatFloat2Dec, formatFloat } from "../../../utils/format";
import useProviderUserInfo from "../../../hooks/useProviderUserInfo";
import { FormattedMessage } from "react-intl";
import { Link } from "gatsby";

/**
 * @typedef {import("../../../services/tradeApiClient.types").ProviderEntity} ProviderEntity
 * @typedef {Object} TraderMiniCardPropTypes
 * @property {ProviderEntity} provider Provider
 */

/**
 * Provides a list of signal providers cards.
 *
 * @param {TraderMiniCardPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const TraderMiniCard = ({ provider }) => {
  const { name, logoUrl, quote, returns, isCopyTrading, id } = provider;
  const providerUserInfo = useProviderUserInfo(id);
  const color = returns >= 0 ? "green" : "red";

  const profileLink = `/${isCopyTrading ? "copyTraders" : "signalProviders"}/${id}`;

  return (
    <Box
      bgcolor="grid.main"
      className="traderMiniCard"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Box alignItems="center" display="flex" flexDirection="row" justifyContent="space-between">
        <Link className="link" to={profileLink}>
          <Typography className="name" variant="h4">
            {name}
          </Typography>
        </Link>
        <img alt={name} className="logoIcon" src={logoUrl || LogoIcon} />
      </Box>
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Typography variant="h5">
          <FormattedMessage id="srv.allocated" /> {quote}{" "}
          {formatFloat(providerUserInfo.currentAllocated)}
        </Typography>
        <Box display="flex" flexDirection="row">
          <Typography noWrap={true} variant="h5">
            <FormattedMessage id="col.plpercentage" />
          </Typography>
          <Box pl="7px">
            <Typography className={color} variant="h5">
              {formatFloat2Dec(returns)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TraderMiniCard;
