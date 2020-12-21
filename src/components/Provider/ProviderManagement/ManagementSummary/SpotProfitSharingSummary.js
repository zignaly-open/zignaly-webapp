import React from "react";
import { Box } from "@material-ui/core";
import { FormattedMessage, useIntl } from "react-intl";
import ManagementSummaryCard from "../ManagementSummaryCard";
import { formatFloat, formatFloat2Dec } from "../../../../utils/format";
import useProviderFollowersCount from "../../../../hooks/useProviderFollowersCount";

/**
 * @typedef {import('../../../../services/tradeApiClient.types').DefaultProviderGetObject} DefaultProviderGetObject
 * @typedef {import("../../../../services/tradeApiClient.types").ProviderBalanceEntity} ProviderBalanceEntity
 * @typedef {Object} DefaultProps
 * @property {DefaultProviderGetObject} provider Provider Object.
 * @property {ProviderBalanceEntity} summary Provider Object.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ProfitSharingSummary = ({ provider, summary }) => {
  const { counts } = useProviderFollowersCount(provider.id);
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
        foot={`${intl.formatMessage({ id: "menu.demo" })}: ${0}`}
        icon="followers"
        title={<FormattedMessage id="copyt.management.totalfollowers" />}
        tooltip={intl.formatMessage({ id: "copyt.management.totalfollowers.tooltip" })}
        value={counts.followers}
      />

      <ManagementSummaryCard
        foot={`BTC: ${formatFloat(summary.totalWalletBTC)}`}
        icon="allocated"
        quote="USDT"
        title={<FormattedMessage id="copyt.management.wallet" />}
        tooltip={intl.formatMessage({ id: "copyt.management.wallet.tooltip" })}
        value={formatFloat2Dec(summary.totalWalletUSDT)}
      />

      <ManagementSummaryCard
        foot={`BTC ${formatFloat(summary.totalPnlBTC)}`}
        icon="profit"
        quote="USDT"
        title={<FormattedMessage id="copyt.management.profit" />}
        value={`${formatFloat2Dec(summary.totalPnlUSDT)}`}
        valueColor={summary.totalPnlBTC > 0 ? "green" : summary.totalPnlBTC < 0 ? "red" : ""}
      />

      <ManagementSummaryCard
        foot={`BTC ${formatFloat(summary.totalInvestedBTC)}`}
        icon="balance"
        quote="USDT"
        title={<FormattedMessage id="copyt.management.invested" />}
        tooltip={intl.formatMessage({ id: "copyt.management.invested.tooltip" })}
        value={formatFloat2Dec(summary.totalInvestedUSDT)}
      />

      <ManagementSummaryCard
        foot={`USDT ${formatFloat(summary.totalFreeUSDT)}`}
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
