import React from "react";
import "./ProviderHeaderActions.scss";
import { Box, Typography } from "@material-ui/core";
import useStoreViewsSelector from "../../../../hooks/useStoreViewsSelector";
import CustomButton from "../../../CustomButton";
import { FormattedMessage } from "react-intl";
import LogoIcon from "../../../../images/logo/logoIcon.svg";
import CopyTraderButton from "../CopyTraderButton";
/**
 * Provides the navigation bar for the dashboard.
 *
 * @returns {JSX.Element} Component JSX.
 */
const ProviderHeaderActions = () => {
  const storeViews = useStoreViewsSelector();

  const payFee = () => {};

  return (
    <Box
      alignItems="center"
      className="providerHeaderActions"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
    >
      <Box
        className="titleBox"
        alignItems="center"
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
      >
        <img
          className="providerLogo"
          onError={(e) => (e.target.src = LogoIcon)}
          src={storeViews.provider.logoUrl ? storeViews.provider.logoUrl : LogoIcon}
        />
        <Typography variant="h1">{storeViews.provider.name}</Typography>
      </Box>
      <CopyTraderButton provider={storeViews.provider} />
      <Typography variant="h4">
        <FormattedMessage id="copyt.trial" />
        <b>
          {storeViews.provider.internalPaymentInfo.trial
            ? storeViews.provider.internalPaymentInfo.trial
            : 0}
        </b>
      </Typography>
      <CustomButton className="textPurple" onClick={payFee}>
        <FormattedMessage id="copyt.paymonthlyfee" />
      </CustomButton>
    </Box>
  );
};

export default ProviderHeaderActions;
