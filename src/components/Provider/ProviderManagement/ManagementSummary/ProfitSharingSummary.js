import React from "react";
import { Box, CircularProgress } from "@material-ui/core";
import { FormattedMessage, useIntl } from "react-intl";
import ManagementSummaryCard from "../ManagementSummaryCard";
import { formatFloat2Dec } from "../../../../utils/format";
import usePSManagementSymmary from "../../../../hooks/usePSManagementSymmary";

/**
 * @typedef {import('../../../../services/tradeApiClient.types').DefaultProviderGetObject} DefaultProviderGetObject
 * @typedef {Object} DefaultProps
 * @property {DefaultProviderGetObject} provider Provider Object.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ProfitSharingSummary = ({ provider }) => {
  const { summaryLoading, summary } = usePSManagementSymmary(provider.id);
  const intl = useIntl();
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
            foot={`${intl.formatMessage({ id: "copyt.management.trialing" })}: ${
              summary.followersTrialing
            }`}
            icon="followers"
            title={<FormattedMessage id="copyt.management.totalfollowers" />}
            tooltip={intl.formatMessage({ id: "copyt.management.totalfollowers.tooltip" })}
            value={summary.totalFollowers}
          />

          <ManagementSummaryCard
            foot={`USDT: ${formatFloat2Dec(summary.totalAllocatedUSDTFromFollowers)}`}
            icon="allocated"
            quote={summary.quote}
            title={<FormattedMessage id="copyt.management.wallet" />}
            tooltip={intl.formatMessage({ id: "copyt.management.wallet.tooltip" })}
            value={formatFloat2Dec(summary.totalAllocatedFromFollowers)}
          />

          <ManagementSummaryCard
            foot={`USDT ${formatFloat2Dec(summary.freeBalanceUSDT)}`}
            icon="profit"
            title={<FormattedMessage id="copyt.management.profit" />}
            value={`${formatFloat2Dec(summary.freeBalancePercentage)}%`}
            valueColor="green"
          />

          <ManagementSummaryCard
            foot={`USDT ${formatFloat2Dec(summary.totalProfitUSDT)}`}
            icon="balance"
            percentage={`${formatFloat2Dec(summary.totalProfitPercentage)}%`}
            quote={summary.quote}
            title={<FormattedMessage id="copyt.management.margin" />}
            tooltip={intl.formatMessage({ id: "copyt.management.margin.tooltip" })}
            value={formatFloat2Dec(summary.totalProfit)}
          />

          <ManagementSummaryCard
            foot={`USDT ${formatFloat2Dec(summary.floatUSDT)}`}
            icon="balance"
            percentage={`${formatFloat2Dec(summary.floatPercentage)}%`}
            quote={summary.quote}
            title={<FormattedMessage id="copyt.management.available" />}
            tooltip={intl.formatMessage({ id: "copyt.management.available.tooltip" })}
            value={formatFloat2Dec(summary.float)}
          />
        </Box>
      )}
    </>
  );
};

export default ProfitSharingSummary;
