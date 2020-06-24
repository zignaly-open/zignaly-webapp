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

const SignalProvidersSettings = () => {
  const storeSettings = useStoreSettingsSelector();
  const storeSession = useStoreSessionSelector();
  const storeViews = useStoreViewsSelector();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({});

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
        // setLoading(false);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };

  useEffect(loadSettings, []);

  return (
    <Box bgcolor="grid.main" className="profileSettingsPage">
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
      {!loading && <Box>murad malik</Box>}
    </Box>
  );
};

export default compose(withProviderLayout)(SignalProvidersSettings);
