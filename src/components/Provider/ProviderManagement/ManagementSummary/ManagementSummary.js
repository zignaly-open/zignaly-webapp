import React from "react";
import "./ManagementSummary.scss";
import { Box, CircularProgress } from "@material-ui/core";
import useManagementSymmary from "../../../../hooks/useManagementSymmary";
import ProfitSharingSummary from "./ProfitSharingSummary";
import CopyTraderSummary from "./CopyTraderSummary";

/**
 * @typedef {import('../../../../services/tradeApiClient.types').DefaultProviderGetObject} DefaultProviderGetObject
 * @typedef {Object} DefaultProps
 * @property {DefaultProviderGetObject} provider Balance
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ManagementSummary = ({ provider }) => {
  const { summaryLoading, summary } = useManagementSymmary(provider.id);

  return (
    <>
      {summaryLoading && (
        <Box
          alignItems="center"
          className="loadingBox"
          display="flex"
          flexDirection="row"
          justifyContent="center"
        >
          <CircularProgress color="primary" size={40} />
        </Box>
      )}
      {!summaryLoading &&
        (provider.profitSharing ? (
          <ProfitSharingSummary summary={summary} />
        ) : (
          <CopyTraderSummary summary={summary} />
        ))}
    </>
  );
};

export default ManagementSummary;
