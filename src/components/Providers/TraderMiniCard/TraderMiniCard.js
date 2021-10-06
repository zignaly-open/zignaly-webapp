import React from "react";
import { Box, Typography } from "@material-ui/core";
import "./TraderMiniCard.scss";
import { formatFloat2Dec, formatFloat } from "../../../utils/format";
import { FormattedMessage } from "react-intl";
import { Link } from "gatsby";
import ProviderLogo from "../../Provider/ProviderHeader/ProviderLogo";

/**
 * @typedef {Object} TraderMiniCardPropTypes
 * @property {Provider} provider Provider
 */

/**
 * Provides a list of signal providers cards.
 *
 * @param {TraderMiniCardPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const TraderMiniCard = ({ provider }) => {
  const {
    name,
    logoUrl,
    quote,
    providerLink,
    verified,
    profitsSinceCopying,
    allocatedBalance,
    currentAllocated,
  } = provider;

  let profitPerc = 0;
  if (profitsSinceCopying && allocatedBalance) {
    profitPerc = (profitsSinceCopying / allocatedBalance) * 100;
  }
  const color = profitPerc >= 0 ? "green" : "red";

  return (
    <Box
      bgcolor="grid.main"
      className="traderMiniCard"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Box alignItems="center" display="flex" flexDirection="row" justifyContent="space-between">
        <Link className="link" to={providerLink}>
          <Typography className="name" variant="h4">
            {name}
          </Typography>
        </Link>
        <ProviderLogo size="32px" title={name} url={logoUrl} verified={verified} />
      </Box>
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Typography variant="h5">
          <FormattedMessage id="srv.allocated" /> {quote} {formatFloat(currentAllocated)}
        </Typography>
        <Box display="flex" flexDirection="row">
          <Typography noWrap={true} variant="h5">
            <FormattedMessage id="col.plpercentage" />
          </Typography>
          <Box pl="7px">
            <Typography className={color} variant="h5">
              {formatFloat2Dec(profitPerc)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TraderMiniCard;
