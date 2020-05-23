import React from "react";
import { Box } from "@material-ui/core";
import TraderCard from "../../../components/TraderCard";
import "./providersList.scss";

/**
 * @typedef {import("../../../services/tradeApiClient.types").ProvidersCollection} ProvidersCollection
 * @typedef {Object} ProvidersListPropTypes
 * @property {ProvidersCollection} providers Flag to indicate if filters should be rendered.
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
      <Box
        alignItems="center"
        className="tradersBox"
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="space-between"
      >
        {providers &&
          providers.map((provider) => (
            <TraderCard provider={provider} showSummary={showSummary} key={provider.id} />
          ))}
      </Box>
    </Box>
  );
};

export default ProvidersList;
