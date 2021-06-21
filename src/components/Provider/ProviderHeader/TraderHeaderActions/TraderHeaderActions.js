import React from "react";
import "./TraderHeaderActions.scss";
import { Box, Typography, Hidden } from "@material-ui/core";
import CopyTraderButton from "../CopyTraderButton";
import PaymentButton from "../PaymentButton";
import TrialPeriod from "./TrialPeriod";
import CloneEdit from "../CloneEdit";
import ProviderLogo from "../ProviderLogo";
import FollowProviderButton from "../FollowProviderButton";
import { FormattedMessage } from "react-intl";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 */

/**
 * Trader Header Actions compoennt for CT profile.
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const TraderHeaderActions = ({ provider }) => {
  return (
    <Box
      alignItems="center"
      className="traderHeaderActions"
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      justifyContent="flex-start"
    >
      <Box
        alignItems="center"
        className="titleBox"
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
      >
        <ProviderLogo size="40px" title={provider.name} url={provider.logoUrl} />
        <Typography variant="h1">{provider.name}</Typography>
        {provider.isAdmin && provider.isClone && <CloneEdit provider={provider} />}
      </Box>
      {provider.isCopyTrading ? (
        !provider.liquidated ? (
          <CopyTraderButton provider={provider} />
        ) : (
          <Typography variant="h4" className="red">
            <FormattedMessage id="srv.liquidated" />
          </Typography>
        )
      ) : (
        <FollowProviderButton provider={provider} />
      )}
      <Hidden xsDown>
        {!provider.profitSharing && provider.internalPaymentInfo && (
          <TrialPeriod provider={provider} />
        )}
        {!provider.disable && !provider.profitSharing && provider.internalPaymentInfo && (
          <PaymentButton provider={provider} />
        )}
      </Hidden>
    </Box>
  );
};

export default TraderHeaderActions;
