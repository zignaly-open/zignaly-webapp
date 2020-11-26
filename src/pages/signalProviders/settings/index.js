import React, { useState, useEffect } from "react";
import "./settings.scss";
import { Box } from "@material-ui/core";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";
import ProviderSettingsForm from "../../../components/Forms/ProviderSettingsForm";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import NoSettingsView from "../../../components/Provider/Settings/NoSettingsView";

/**
 * @typedef {import("../../../services/tradeApiClient.types").ProviderExchangeSettingsObject} ProviderExchangeSettingsObject
 * @typedef {import("../../../services/tradeApiClient.types").QuoteAssetsDict} QuoteAssetsDict
 */

/**
 * @typedef {Object} ProviderProps
 * @property {QuoteAssetsDict} quotes quotes
 * @property {ProviderExchangeSettingsObject} settings settings
 * @property {Function} loadData load data method
 */

/**
 * Position detail page component.
 *
 * @param {ProviderProps} props Component properties.
 * @returns {JSX.Element} Position page element.
 */
const SignalProvidersSettings = ({ quotes, settings, loadData }) => {
  const { selectedExchange } = useStoreSettingsSelector();
  const { provider } = useStoreViewsSelector();
  const [settingsView, setSettingsView] = useState(false);
  const intl = useIntl();
  const matchExchange = () => {
    if (provider.exchangeInternalId === selectedExchange.internalId) {
      setSettingsView(true);
    } else {
      setSettingsView(false);
    }
  };

  useEffect(matchExchange, [selectedExchange.internalId]);

  return (
    <Box className="profileSettingsPage">
      <Helmet>
        <title>
          {`${provider.name} - ${intl.formatMessage({
            id: "srv.settings",
          })} | ${intl.formatMessage({ id: "product" })}`}
        </title>
      </Helmet>
      {settingsView && (
        <ProviderSettingsForm onUpdate={loadData} quotes={quotes} settings={settings} />
      )}

      {!settingsView && <NoSettingsView />}
    </Box>
  );
};

export default SignalProvidersSettings;
