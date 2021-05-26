import React from "react";
import { Box, CircularProgress } from "@material-ui/core";
import TraderCard from "../../../components/TraderCard";
import "./ProvidersList.scss";

/**
 * @typedef {import("../../../services/tradeApiClient.types").ProvidersCollection} ProvidersCollection
 * @typedef {import("../../../services/tradeApiClient.types").NewAPIProvidersPayload} NewAPIProvidersPayload
 * @typedef {Object} ProvidersListPropTypes
 * @property {ProvidersCollection} providers Flag to indicate if filters should be rendered.
 * @property {boolean} showSummary Flag to indicate if summary should be rendered.
 * @property {number} timeFrame Selected timeFrame.
 * @property {Function} reloadProviders reload providers list.
 */

/**
 * Provides a list of signal providers cards.
 *
 * @param {ProvidersListPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const ProvidersList = (props) => {
  const { providers, showSummary, timeFrame, reloadProviders } = props;

  return (
    <Box
      className="providersList"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      {providers ? (
        <Box className="tradersBox">
          {providers.map((provider) => (
            // <LazyLoad height={450} key={provider.id} offset={950}>
            <TraderCard
              key={provider.id}
              provider={provider}
              reloadProviders={reloadProviders}
              showSummary={showSummary}
              timeFrame={timeFrame}
            />
            // </LazyLoad>
          ))}
        </Box>
      ) : (
        <CircularProgress className="loader" />
      )}
    </Box>
  );
};

export default ProvidersList;
