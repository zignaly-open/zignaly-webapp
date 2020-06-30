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
        foot={summary.followersTrialing}
        icon="followers"
        title={<FormattedMessage id="copyt.management.totalfollowers" />}
        value={summary.totalFollowers}
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
        percentage={`${formatFloat2Dec(summary.freeBalancePercentage)}%`}
        quote={summary.quote}
        title={<FormattedMessage id="copyt.management.freebalance" />}
        value={formatFloat2Dec(summary.freeBalance)}
      />

      <ManagementSummaryCard
        foot={`USDT ${formatFloat2Dec(summary.totalProfitUSDT)}`}
        icon="profit"
        percentage={`${formatFloat2Dec(summary.totalProfitPercentage)}%`}
        quote={summary.quote}
        title={<FormattedMessage id="copyt.management.totalprofit" />}
        value={formatFloat2Dec(summary.totalProfit)}
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
  );
};

export default ManagementSummary;
