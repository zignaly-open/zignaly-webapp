import React from "react";
import { Box, CircularProgress } from "@material-ui/core";
import TraderCard from "../../../components/TraderCard";
import "./ProvidersList.scss";
import LazyLoad from "react-lazyload";

/**
 * @typedef {import("../../../services/tradeApiClient.types").ProvidersCollection} ProvidersCollection
 * @typedef {Object} ProvidersListPropTypes
 * @property {ProvidersCollection} providers Flag to indicate if filters should be rendered.
 * @property {boolean} showSummary Flag to indicate if summary should be rendered.
 * @property {number} timeFrame Selected timeFrame.
 */

/**
 * Provides a list of signal providers cards.
 *
 * @param {ProvidersListPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const ProvidersList = (props) => {
  const { providers, showSummary, timeFrame } = props;
  return (
    <Box
      className="providersList"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      <Box className="tradersBox">
        {providers.length ? (
          providers.map((provider) => (
            <LazyLoad height={450} offset={800}>
              <TraderCard
                key={provider.id}
                provider={provider}
                showSummary={showSummary}
                timeFrame={timeFrame}
              />
            </LazyLoad>
          ))
        ) : (
          <CircularProgress size={21} />
        )}
      </Box>
    </Box>
  );
};

export default ProvidersList;
