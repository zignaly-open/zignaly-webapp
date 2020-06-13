import React from "react";
import { Box, Typography } from "@material-ui/core";
import LogoIcon from "../../../images/logo/logoIcon.svg";
import "./TraderMiniCard.scss";
import { formatFloat2Dec, formatFloat } from "../../../utils/format";
import useProviderUserInfo from "../../../hooks/useProviderUserInfo";
import { FormattedMessage } from "react-intl";

/**
 * @typedef {import("../../../services/tradeApiClient.types").ProvidersCollection} ProvidersCollection
 * @typedef {Object} ProvidersListPropTypes
 * @property {ProvidersCollection} providers Flag to indicate if filters should be rendered.
 * @property {boolean} showSummary Flag to indicate if summary should be rendered.
 */

/**
 * Provides a list of signal providers cards.
 *
 * @param {ProvidersListPropTypes} props Component properties.
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
      <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">{name}</Typography>
        <img alt={name} className="logoIcon" src={logoUrl || LogoIcon} />
      </Box>
      <Box justifyContent="space-between" display="flex" flexDirection="row">
        <Typography variant="h5">
          {quote} {formatFloat(providerUserInfo.currentAllocated)}
        </Typography>
        <Box display="flex" flexDirection="row">
          <Typography variant="h5">
            <FormattedMessage id="col.plpercentage" />
          </Typography>
          <Box pl="7px">
            <Typography variant="h5" className={color}>
              {formatFloat2Dec(returns)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TraderMiniCard;
