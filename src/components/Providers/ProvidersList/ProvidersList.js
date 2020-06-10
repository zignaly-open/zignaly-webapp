import React from "react";
import { Box } from "@material-ui/core";
import TraderCard from "../../../components/TraderCard";
import "./ProvidersList.scss";

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
const ProvidersList = (props) => {
  const { providers, showSummary } = props;
  return (
    <Box
      className="providersList"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      <Box className="tradersBox">
        {providers &&
          providers.map((provider) => (
            <TraderCard key={provider.id} provider={provider} showSummary={showSummary} />
          ))}
      </Box>
    </Box>
  );
};

export default ProvidersList;
