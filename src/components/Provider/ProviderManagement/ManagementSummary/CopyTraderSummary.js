import React from "react";
import "./ManagementSummary.scss";
import { Box, CircularProgress } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import ManagementSummaryCard from "../ManagementSummaryCard";
import { formatFloat2Dec } from "../../../../utils/format";
import useCTManagementSymmary from "../../../../hooks/useCTManagementSymmary";

/**
 * @typedef {import('../../../../services/tradeApiClient.types').DefaultProviderGetObject} DefaultProviderGetObject
 * @typedef {Object} DefaultProps
 * @property {DefaultProviderGetObject} provider Balance
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const CopyTraderSummary = ({ provider }) => {
  const { summaryLoading, summary } = useCTManagementSymmary(provider.id);
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
      {!summaryLoading && (
        <Box
          alignItems="center"
          className="managementSummary"
          display="flex"
          flexDirection="row"
          justifyContent="space-evenly"
        >
          <ManagementSummaryCard
            foot=" "
            icon="followers"
            title={<FormattedMessage id="copyt.management.totalfollowers" />}
            value={provider.followers}
          />

          <ManagementSummaryCard
            foot={`USDT: ${formatFloat2Dec(summary.totalAllocatedUSDTFromFollowers)}`}
            icon="allocated"
            quote={summary.quote}
            title={<FormattedMessage id="copyt.management.totalallocated" />}
            value={formatFloat2Dec(summary.totalAllocatedFromFollowers)}
          />

          <ManagementSummaryCard
            foot={`USDT ${formatFloat2Dec(summary.freeBalanceUSDT)}`}
            icon="balance"
            title={<FormattedMessage id="copyt.management.freebalance" />}
            value={`${formatFloat2Dec(summary.freeBalancePercentage)}%`}
          />

          <ManagementSummaryCard
            foot={`USDT ${formatFloat2Dec(summary.totalProfitUSDT)}`}
            icon="profit"
            percentage={`${formatFloat2Dec(summary.totalProfitPercentage)}%`}
            quote={summary.quote}
            title={<FormattedMessage id="copyt.management.totalprofit" />}
            value={formatFloat2Dec(summary.totalProfit)}
            valueColor={
              summary.totalProfitUSDT > 0 ? "green" : summary.totalProfitUSDT < 0 ? "red" : ""
            }
          />

          <ManagementSummaryCard
            foot={`USDT ${formatFloat2Dec(summary.floatUSDT)}`}
            icon="float"
            percentage={`${formatFloat2Dec(summary.floatPercentage)}%`}
            quote={summary.quote}
            title={<FormattedMessage id="copyt.management.float" />}
            value={formatFloat2Dec(summary.float)}
          />
        </Box>
      )}
    </>
  );
};

export default CopyTraderSummary;
