import React from "react";
import { Box, Typography } from "@material-ui/core";
import LogoIcon from "../../../images/logo/logoIcon.svg";
import "./TraderMiniCard.scss";
import { formatFloat2Dec, formatFloat } from "../../../utils/format";
import useProviderUserInfo from "../../../hooks/useProviderUserInfo";
import { FormattedMessage } from "react-intl";

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
  const { name, logoUrl, quote, returns } = provider;
  const providerUserInfo = useProviderUserInfo(provider.id);
  const color = returns >= 0 ? "green" : "red";

  return (
    <Box
      className="traderMiniCard"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Box alignItems="center" display="flex" flexDirection="row" justifyContent="space-between">
        <Typography className="name" variant="h4">
          {name}
        </Typography>
        <img alt={name} className="logoIcon" src={logoUrl || LogoIcon} />
      </Box>
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Typography variant="h5">
          {quote} {formatFloat(providerUserInfo.currentAllocated)}
        </Typography>
        <Box display="flex" flexDirection="row">
          <Typography variant="h5">
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
