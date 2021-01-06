import React from "react";
import { Box } from "@material-ui/core";
import { FuturesProfitSharingSummary } from "./ManagementSummary";
import ManagementTabs from "./ManagementTabs";

/**
 * @typedef {import("../../../services/tradeApiClient.types").ExchangeConnectionEntity} ExchangeConnectionEntity
 * @typedef {import("../../../services/tradeApiClient.types").DefaultProviderGetObject} DefaultProviderGetObject
 * @typedef {Object} DefaultProps
 * @property {DefaultProviderGetObject} provider provider object.
 * @property {ExchangeConnectionEntity} selectedExchange selected exchange object.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const FuturesProfitSharingManagement = ({ provider, selectedExchange }) => {
  return (
    <>
      <Box className="summaryBox">
        <FuturesProfitSharingSummary provider={provider} />
      </Box>

      <Box className="tableBoxBox">
        <ManagementTabs provider={provider} selectedExchange={selectedExchange} />
      </Box>
    </>
  );
};

export default FuturesProfitSharingManagement;
