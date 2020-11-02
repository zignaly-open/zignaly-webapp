import React from "react";
import { Box, CircularProgress } from "@material-ui/core";
import { FormattedMessage, useIntl } from "react-intl";
import ManagementSummaryCard from "../ManagementSummaryCard";
import { formatFloat, formatFloat2Dec } from "../../../../utils/format";
import usePSManagementSymmary from "../../../../hooks/usePSManagementSymmary";
import useProviderFollowersCount from "../../../../hooks/useProviderFollowersCount";

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
  const { counts } = useProviderFollowersCount(provider.id);
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
            foot={`BTC ${formatFloat(summary.totalUnrealizedProfitBTC)}`}
            icon="profit"
            quote="USDT"
            title={<FormattedMessage id="copyt.management.profit" />}
            value={`${formatFloat2Dec(summary.totalUnrealizedProfitUSDT)}`}
            valueColor={
              summary.totalUnrealizedProfitBTC > 0
                ? "green"
                : summary.totalUnrealizedProfitBTC < 0
                ? "red"
                : ""
            }
          />

          <ManagementSummaryCard
            foot={`BTC ${formatFloat(summary.totalMarginBTC)}`}
            icon="balance"
            quote="USDT"
            title={<FormattedMessage id="copyt.management.margin" />}
            tooltip={intl.formatMessage({ id: "copyt.management.margin.tooltip" })}
            value={formatFloat2Dec(summary.totalMarginUSDT)}
          />

          <ManagementSummaryCard
            foot={`USDT ${formatFloat(summary.totalMarginUSDT - summary.totalCurrentMarginUSDT)}`}
            icon="balance"
            quote="%"
            title={<FormattedMessage id="copyt.management.available" />}
            tooltip={intl.formatMessage({ id: "copyt.management.available.tooltip" })}
            value={formatFloat2Dec(summary.abstractPercentage)}
          />
        </Box>
      )}
    </>
  );
};

export default ProfitSharingSummary;
