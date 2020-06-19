import React from "react";
import "./ProviderHeaderActions.scss";
import { Box, Typography } from "@material-ui/core";
import useStoreViewsSelector from "../../../../hooks/useStoreViewsSelector";
import LogoIcon from "../../../../images/logo/logoIcon.svg";
import CopyTraderButton from "../CopyTraderButton";
import PaymentButton from "../PaymentButton";
import TrialPeriod from "./TrialPeriod";

/**
 * Provides the navigation bar for the dashboard.
 *
 * @returns {JSX.Element} Component JSX.
 */
const ProviderHeaderActions = () => {
  const storeViews = useStoreViewsSelector();

  /**
   * Funcrtion to handle image url loading error.
   *
   * @param {React.SyntheticEvent} e Error event received.
   * @returns {void} None.
   */
  const onLogoError = (e) => {
    const targetElement = /** @type {HTMLInputElement} */ (e.target);
    targetElement.src = LogoIcon;
  };

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
        <img
          className="providerLogo"
          onError={onLogoError}
          src={storeViews.provider.logoUrl ? storeViews.provider.logoUrl : LogoIcon}
        />
        <Typography variant="h1">{storeViews.provider.name}</Typography>
      </Box>
      <CopyTraderButton provider={storeViews.provider} />
      <TrialPeriod provider={storeViews.provider} />
      <PaymentButton provider={storeViews.provider} />
    </Box>
  );
};

export default ProviderHeaderActions;
