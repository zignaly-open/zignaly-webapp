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
 * @property {ProvidersCollection} providers Flag to indicate if filters should be rendered.
 * @property {boolean} showSummary Flag to indicate if summary should be rendered.
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
      <Box display="flex" flexDirection="row" alignItems="center" className="boxTitle">
        <Typography variant="h3">
          <FormattedMessage id="accounts.copying" />
        </Typography>

        <Link to="dashboard/connectedTraders">
          <Typography variant="subtitle1" className="textPurple">
            <FormattedMessage id="accounts.connected" />
          </Typography>
        </Link>
      </Box>
      <Box display="flex" flexDirection="column" className="scrollCards">
        {providers.map((p) => (
          <TraderMiniCard provider={p} key={p.id} />
        ))}
        <CustomButton className="textPurple">
          <Link to="dashboard/connectedTraders">
            <FormattedMessage id="accounts.browse" />
          </Link>
        </CustomButton>
      </Box>
    </Box>
  );
};

export default ConnectedProvidersSummary;
