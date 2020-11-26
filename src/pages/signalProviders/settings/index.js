import React, { useState, useEffect } from "react";
import "./settings.scss";
import { Box, CircularProgress } from "@material-ui/core";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../../../store/actions/ui";
import ProviderSettingsForm from "../../../components/Forms/ProviderSettingsForm";
import { creatEmptySettingsEntity } from "../../../services/tradeApiClient.types";
import useSelectedExchangeQuotes from "../../../hooks/useSelectedExchangeQuotes";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import NoSettingsView from "../../../components/Provider/Settings/NoSettingsView";

const SignalProvidersSettings = () => {
  const { selectedExchange } = useStoreSettingsSelector();
  const storeSession = useStoreSessionSelector();
  const { provider } = useStoreViewsSelector();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const emptySettings = creatEmptySettingsEntity();
  const [settings, setSettings] = useState(emptySettings);
  const quoteAssets = useSelectedExchangeQuotes(selectedExchange.internalId);
  const quotes =
    selectedExchange.name.toLowerCase() === "bitmex"
      ? { BTC: { quote: "BTC", minNotional: 0 } }
      : quoteAssets;
  const [settingsView, setSettingsView] = useState(false);
  const intl = useIntl();
  const quotesAvailable = Object.keys(quotes).length > 0;

  const loadSettings = () => {
    if (
      provider.id &&
      provider.exchangeInternalId === selectedExchange.internalId &&
      quotesAvailable
    ) {
      setLoading(true);
      const payload = {
        token: storeSession.tradeApi.accessToken,
        providerId: provider.id,
        internalExchangeId: selectedExchange.internalId,
        version: 2,
      };
      tradeApi
        .providerExchangeSettingsGet(payload)
        .then((response) => {
          setSettings(response);
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(loadSettings, [selectedExchange.internalId, provider.id, quotesAvailable]);

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
      {loading && (
        <Box
          alignItems="center"
          bgcolor="grid.content"
          className="loadingBox"
          display="flex"
          flexDirection="row"
          justifyContent="center"
        >
          <CircularProgress color="primary" size={40} />
        </Box>
      )}
      {!loading && settingsView && (
        <ProviderSettingsForm onUpdate={loadSettings} quotes={quotes} settings={settings} />
      )}

      {!loading && !settingsView && <NoSettingsView />}
    </Box>
  );
};

export default SignalProvidersSettings;
