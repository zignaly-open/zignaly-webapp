import React from "react";
import "./ManagementSummary.scss";
import { Box } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { formatFloat2Dec } from "../../../../utils/format";
import ManagementSummaryCard from "../ManagementSummaryCard";

/**
 *
 * @typedef {import('../../../../services/tradeApiClient.types').ProviderDataPointsEntity} ProviderDataPointsEntity
 */

/**
 * @typedef {Object} DefaultProps
 * @property {ProviderDataPointsEntity} summary Balance
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ManagementSummary = ({ summary }) => {
  return (
    <Box
      alignItems="center"
      className="managementSummary"
      display="flex"
      flexDirection="row"
      justifyContent="space-evenly"
    >
      <ManagementSummaryCard
        title={<FormattedMessage id="copyt.management.totalfollowers" />}
        value={summary.totalFollowers}
        icon="followers"
        foot={summary.followersTrialing}
      />

      <ManagementSummaryCard
        title={<FormattedMessage id="copyt.management.totalallocated" />}
        value={formatFloat2Dec(summary.totalAllocatedFromFollowers)}
        icon="allocated"
        foot={`USDT: ${formatFloat2Dec(summary.totalAllocatedUSDTFromFollowers)}`}
        quote={summary.quote}
      />

      <ManagementSummaryCard
        title={<FormattedMessage id="copyt.management.freebalance" />}
        value={formatFloat2Dec(summary.freeBalance)}
        quote={summary.quote}
        icon="balance"
        foot={`USDT ${formatFloat2Dec(summary.freeBalanceUSDT)}`}
        percentage={`${formatFloat2Dec(summary.freeBalancePercentage)}%`}
      />

      <ManagementSummaryCard
        title={<FormattedMessage id="copyt.management.totalprofit" />}
        value={formatFloat2Dec(summary.totalProfit)}
        quote={summary.quote}
        icon="profit"
        foot={`USDT ${formatFloat2Dec(summary.totalProfitUSDT)}`}
        percentage={`${formatFloat2Dec(summary.totalProfitPercentage)}%`}
      />

      <ManagementSummaryCard
        title={<FormattedMessage id="copyt.management.float" />}
        value={formatFloat2Dec(summary.float)}
        quote={summary.quote}
        icon="float"
        foot={`USDT ${formatFloat2Dec(summary.floatUSDT)}`}
        percentage={`${formatFloat2Dec(summary.floatPercentage)}%`}
      />
    </Box>
  );
};

export default ManagementSummary;
