import React from "react";
import "./ProviderHeaderActions.scss";
import { Box, Typography } from "@material-ui/core";
import useStoreViewsSelector from "../../../../hooks/useStoreViewsSelector";
import CustomButton from "../../../CustomButton";
import { FormattedMessage } from "react-intl";
import LogoIcon from "../../../../images/logo/logoIcon.svg";
/**
 * Provides the navigation bar for the dashboard.
 *
 * @returns {JSX.Element} Component JSX.
 */
const ProviderHeaderActions = () => {
  const storeViews = useStoreViewsSelector();

  const copyThisTrader = () => {};

  return (
    <Box
      alignItems="center"
      className="providerHeaderActions"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
    >
      <img
        src={storeViews.provider.logoUrl ? storeViews.provider.logoUrl : LogoIcon}
        onError={(e) => (e.target.src = LogoIcon)}
        className="providerLogo"
      />
      <Typography variant="h1">{storeViews.provider.name}</Typography>
      {storeViews.provider.exchangeInternalId && (
        <CustomButton className="loadMoreButton" onClick={copyThisTrader}>
          <FormattedMessage id="copyt.stopcopyingtrader" />
        </CustomButton>
      )}
      {!storeViews.provider.exchangeInternalId && (
        <CustomButton className="submitButton" onClick={copyThisTrader}>
          <FormattedMessage id="copyt.copythistrader" />
        </CustomButton>
      )}
      <Typography variant="h4">
        <FormattedMessage id="copyt.trial" />
        <b>
          {storeViews.provider.internalPaymentInfo.trial
            ? storeViews.provider.internalPaymentInfo.trial
            : 0}
        </b>
      </Typography>
      <CustomButton className="textPurple" onClick={copyThisTrader}>
        <FormattedMessage id="copyt.paymonthlyfee" />
      </CustomButton>
    </Box>
  );
};

export default ProviderHeaderActions;
