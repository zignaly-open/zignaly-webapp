import React from "react";
import PropTypes from "prop-types";
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
  const { providers } = props;
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
          providers.map((item) => (
            <TraderCard
              coin={item.coin}
              dailyReturns={item.dailyReturns}
              exchanges={[]}
              fee={item.fee}
              id={item.id}
              isCopyTrading={false}
              key={item.id}
              logoUrl={item.logoUrl}
              name={item.name}
              risk={item.risk}
              showSummary={false}
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
