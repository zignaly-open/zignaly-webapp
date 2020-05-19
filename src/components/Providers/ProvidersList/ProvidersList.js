import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box } from "@material-ui/core";
import TraderCard from "../../../components/TraderCard";

/**
 * @typedef {import("../../../services/tradeApiClient.types").SignalProvidersCollection} SignalProvidersCollection
 *
 * @typedef {Object} ProvidersListPropTypes
 * @property {SignalProvidersCollection} providers Flag to indicate if filters should be rendered.
 */

/**
 * Provides a list of signal providers cards.
 *
 * @param {ProvidersListPropTypes} props Component properties.
 * @returns {Object} Component JSX.
 */
const ProvidersList = (props) => {
  const { providers } = props;
  return (
    <Box display="flex" flexDirection="column" justifyContent="flex-start">
      <Box
        alignItems="center"
        className="tradersBox"
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="space-between"
      >
        {providers &&
          providers.map((item) => (
            <TraderCard
              key={item}
              id={item.id}
              returns={item.returns}
              risk={item.risk}
              showSummary={false}
              coin={item.coin}
              fee={item.fee}
              logoUrl={item.logoUrl}
              name={item.name}
            />
          ))}
      </Box>
    </Box>
  );
};

ProvidersList.propTypes = {
  providers: PropTypes.array.isRequired,
};

export default ProvidersList;
