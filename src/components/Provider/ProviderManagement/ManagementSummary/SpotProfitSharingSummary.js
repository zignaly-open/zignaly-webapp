import React from "react";
import { Box } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import ManagementSummaryCard from "../ManagementSummaryCard";
import { formatFloat, formatFloat2Dec } from "../../../../utils/format";

/**
 * @typedef {import('../../../../services/tradeApiClient.types').DefaultProviderGetObject} DefaultProviderGetObject
 * @typedef {import("../../../../services/tradeApiClient.types").SpotProviderBalanceEntity} SpotProviderBalanceEntity
 * @typedef {Object} DefaultProps
 * @property {DefaultProviderGetObject} provider Provider Object.
 * @property {SpotProviderBalanceEntity} summary Provider Object.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ProfitSharingSummary = ({ provider, summary }) => {
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
        foot=" "
        icon="followers"
        title={<FormattedMessage id="copyt.management.totalfollowers" />}
        tooltip={intl.formatMessage({ id: "copyt.management.totalfollowers.tooltip" })}
        value={provider.followers}
      />

      <ManagementSummaryCard
        foot=" "
        icon="allocated"
        quote={provider.copyTradingQuote}
        title={<FormattedMessage id="copyt.management.wallet" />}
        tooltip={intl.formatMessage({ id: "copyt.management.wallet.tooltip" })}
        value={formatFloat2Dec(summary.totalWallet)}
      />

      <ManagementSummaryCard
        foot=" "
        icon="profit"
        quote={provider.copyTradingQuote}
        title={<FormattedMessage id="copyt.management.profit" />}
        value={`${formatFloat2Dec(summary.totalPnl)}`}
        valueColor={summary.totalPnl > 0 ? "green" : summary.totalPnl < 0 ? "red" : ""}
      />

      <ManagementSummaryCard
        foot=" "
        icon="balance"
        quote={provider.copyTradingQuote}
        title={<FormattedMessage id="copyt.management.invested" />}
        tooltip={intl.formatMessage({ id: "copyt.management.invested.tooltip" })}
        value={formatFloat2Dec(summary.totalInvested)}
      />

      <ManagementSummaryCard
        foot={`${provider.copyTradingQuote} ${formatFloat(
          (summary.totalFree * summary.abstractPercentage) / 100,
        )}`}
        icon="balance"
        quote="%"
        title={<FormattedMessage id="copyt.management.available" />}
        tooltip={intl.formatMessage({ id: "copyt.management.available.tooltip" })}
        value={formatFloat2Dec(summary.abstractPercentage)}
      />
    </Box>
  );
};

export default ProfitSharingSummary;
