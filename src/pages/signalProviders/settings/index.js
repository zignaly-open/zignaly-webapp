import React, { useState, useEffect } from "react";
import "./settings.scss";
import { Box, CircularProgress } from "@material-ui/core";
import withProviderLayout from "../../../layouts/providerLayout";
import { compose } from "recompose";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../../../store/actions/ui";
import ProviderSettingsForm from "../../../components/Forms/ProviderSettingsForm";
import { creatEmptySettingsEntity } from "../../../services/tradeApiClient.types";

const SignalProvidersSettings = () => {
  const storeSettings = useStoreSettingsSelector();
  const storeSession = useStoreSessionSelector();
  const storeViews = useStoreViewsSelector();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const emptySettings = creatEmptySettingsEntity();
  const [settings, setSettings] = useState(emptySettings);

  const loadSettings = () => {
    setLoading(true);
    const payload = {
      token: storeSession.tradeApi.accessToken,
      providerId: storeViews.provider.id,
      internalExchangeId: storeSettings.selectedExchange.internalId,
    };
    tradeApi
      .providerExchangeSettingsGet(payload)
      .then((response) => {
        setSettings(response);
        setLoading(false);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };

  useEffect(loadSettings, []);

  return (
    <Box className="profileSettingsPage">
      {loading && (
        <Box
          bgcolor="grid.main"
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          className="loadingBox"
        >
          <CircularProgress size={40} color="primary" />
        </Box>
      )}
      {!loading && <ProviderSettingsForm settings={settings} />}
    </Box>
  );
};

export default compose(withProviderLayout)(SignalProvidersSettings);
