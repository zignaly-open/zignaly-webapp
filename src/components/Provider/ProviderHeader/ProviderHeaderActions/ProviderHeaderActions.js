import React from "react";
import "./ProviderHeaderActions.scss";
import { Box, Typography } from "@material-ui/core";
import useStoreViewsSelector from "../../../../hooks/useStoreViewsSelector";
import PaymentButton from "../PaymentButton";
import TrialPeriod from "./TrialPeriod";
import { FormattedMessage } from "react-intl";
import FollowProviderButton from "../FollowProviderButton";
import ProviderLogo from "../ProviderLogo/";
import CloneEdit from "../CloneEdit";

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
      className="providerHeaderActions"
      display="flex"
      flexDirection="row"
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
      <FollowProviderButton provider={storeViews.provider} />

      {storeViews.provider.internalPaymentInfo && <TrialPeriod provider={storeViews.provider} />}

      <Typography variant="h4">
        <span>
          <FormattedMessage id="srv.followers" />
        </span>
        <b>{storeViews.provider.followers} </b>
      </Typography>

      <Typography variant="h4">
        <span>
          <FormattedMessage id="srv.edit.price" />
        </span>
        <b>{`$${storeViews.provider.price}/Month`}</b>
      </Typography>

      {storeViews.provider.internalPaymentInfo && <PaymentButton provider={storeViews.provider} />}
    </Box>
  );
};

export default ProviderHeaderActions;
