import React from "react";
import { Box, Typography } from "@material-ui/core";
import TraderMiniCard from "../TraderMiniCard";
import "./ConnectedProvidersSummary.scss";
import { FormattedMessage } from "react-intl";
import { Link } from "gatsby";
import CustomButton from "../../CustomButton";

/**
 * @typedef {import("../../../services/tradeApiClient.types").ProvidersCollection} ProvidersCollection
 * @typedef {Object} ProvidersListPropTypes
 * @property {ProvidersCollection} providers Providers.
 */

/**
 * Provides a list of signal providers cards.
 *
 * @param {ProvidersListPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const ConnectedProvidersSummary = ({ providers }) => {
  return (
    <Box className="connectedProvidersSummary">
      <Box alignItems="flex-start" className="boxTitle" display="flex" flexDirection="row">
        <Box alignItems="center" display="flex" flexDirection="row">
          <Typography variant="h3">
            <FormattedMessage id="accounts.copying" />
          </Typography>

          <Link to="dashboard/connectedTraders">
            <Typography className="textPurple" variant="subtitle1">
              <FormattedMessage id="accounts.connected" />
            </Typography>
          </Link>
        </Box>
      </Box>
      <Box alignItems="center" className="scrollCards" display="flex" flexDirection="column">
        {providers.map((p) => (
          <TraderMiniCard key={p.id} provider={p} />
        ))}
        <CustomButton className="textPurple">
          <Link to="copyTraders">
            <FormattedMessage id="accounts.browse" />
          </Link>
        </CustomButton>
      </Box>
    </Box>
  );
};

export default ConnectedProvidersSummary;
