import React, { useState, Fragment, useEffect } from "react";
import "./management.scss";
import { Box, CircularProgress } from "@material-ui/core";
import withProviderLayout from "../../../layouts/providerLayout";
import { compose } from "recompose";
import { creatEmptyProviderDataPointsEntity } from "../../../services/tradeApiClient.types";
import ManagementSummary from "../../../components/Provider/Management/ManagementSummary";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import tradeApi from "../../../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../../../store/actions/ui";

const CopyTradersProfile = () => {
  const storeViews = useStoreViewsSelector();
  const storeSession = useStoreSessionSelector();
  const emptyObject = creatEmptyProviderDataPointsEntity();
  const [summary, setSummary] = useState(emptyObject);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const loadSummary = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      providerId: storeViews.provider.id,
    };
    tradeApi
      .providerCopyTradingDataPointsGet(payload)
      .then((response) => {
        setLoading(false);
        setSummary(response);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };

  useEffect(loadSummary, []);

  return (
    <Box className="profileManagementPage">
      {loading && (
        <Box
          className="loadingBox"
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          bgcolor="grid.main"
        >
          <CircularProgress color="primary" size={40} />
        </Box>
      )}
      {!loading && (
        <Fragment>
          <ManagementSummary summary={summary} />
        </Fragment>
      )}
    </Box>
  );
};

export default compose(withProviderLayout)(CopyTradersProfile);
