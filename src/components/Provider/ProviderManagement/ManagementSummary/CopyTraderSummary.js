import React from "react";
import { Box } from "@material-ui/core";
import { FormattedMessage, useIntl } from "react-intl";
import ManagementSummaryCard from "../ManagementSummaryCard";
import { formatFloat2Dec } from "../../../../utils/format";

/**
 * @typedef {import('../../../../services/tradeApiClient.types').ProviderDataPointsEntity} ProviderDataPointsEntity
 * @typedef {Object} DefaultProps
 * @property {ProviderDataPointsEntity} summary Balance
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const CopyTraderSummary = ({ summary }) => {
  const intl = useIntl();
  return (
    <Box
      alignItems="center"
      className="managementSummary"
      display="flex"
      flexDirection="row"
      justifyContent="space-evenly"
    >
      <ManagementSummaryCard
        foot={`${intl.formatMessage({ id: "copyt.management.trialing" })}: ${
          summary.followersTrialing
        }`}
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
  );
};

export default CopyTraderSummary;
