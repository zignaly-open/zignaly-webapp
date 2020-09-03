import React from "react";
import "./TraderHeaderActions.scss";
import { Box, Typography, Hidden } from "@material-ui/core";
import useStoreViewsSelector from "../../../../hooks/useStoreViewsSelector";
import CopyTraderButton from "../CopyTraderButton";
import PaymentButton from "../PaymentButton";
import TrialPeriod from "./TrialPeriod";
import CloneEdit from "../CloneEdit";
import ProviderLogo from "../ProviderLogo";
import FollowProviderButton from "../FollowProviderButton";

/**
 * Provides the navigation bar for the dashboard.
 *
 * @returns {JSX.Element} Component JSX.
 */
const ProviderHeaderActions = () => {
  const storeViews = useStoreViewsSelector();

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
        <ProviderLogo
          size="40px"
          title={storeViews.provider.name}
          url={storeViews.provider.logoUrl}
        />
        <Typography variant="h1">{storeViews.provider.name}</Typography>
        {storeViews.provider.isAdmin && storeViews.provider.isClone && (
          <CloneEdit provider={storeViews.provider} />
        )}
      </Box>
      {storeViews.provider.isCopyTrading ? (
        <CopyTraderButton provider={storeViews.provider} />
      ) : (
        <FollowProviderButton provider={storeViews.provider} />
      )}
      <Hidden xsDown>
        {storeViews.provider.internalPaymentInfo && <TrialPeriod provider={storeViews.provider} />}
        {storeViews.provider.internalPaymentInfo && (
          <PaymentButton provider={storeViews.provider} />
        )}
      </Hidden>
    </Box>
  );
};

export default ProviderHeaderActions;
