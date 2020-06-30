import React, { useState, useEffect } from "react";
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
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [positionsLoading, setPositionsLoading] = useState(false);
  const dispatch = useDispatch();

  const loadSummary = () => {
    setSummaryLoading(true);
    const payload = {
      token: storeSession.tradeApi.accessToken,
      providerId: storeViews.provider.id,
    };
    tradeApi
      .providerCopyTradingDataPointsGet(payload)
      .then((response) => {
        setSummaryLoading(false);
        setSummary(response);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };

  useEffect(loadSummary, []);

  const loadPositions = () => {
    setPositionsLoading(true);
    const payload = {
      token: storeSession.tradeApi.accessToken,
      providerId: storeViews.provider.id,
    };
    tradeApi
      .providerManagementPositions(payload)
      .then((response) => {
        setPositionsLoading(false);
        setSummary(response);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };

  useEffect(loadPositions, []);

  return (
    <Box className="profileManagementPage">
      <Box className="summaryBox">
        {summaryLoading && (
          <Box
            alignItems="center"
            className="loadingBox"
            display="flex"
            flexDirection="row"
            justifyContent="center"
          >
            <CircularProgress color="primary" size={40} />
          </Box>
        )}
        {!summaryLoading && <ManagementSummary summary={summary} />}
      </Box>

      <Box className="tableBoxBox">
        {positionsLoading && (
          <Box
            alignItems="center"
            className="loadingBox"
            display="flex"
            flexDirection="row"
            justifyContent="center"
          >
            <CircularProgress color="primary" size={40} />
          </Box>
        )}
        {!positionsLoading && <ManagementSummary summary={summary} />}
      </Box>
    </Box>
  );
};

export default compose(withProviderLayout)(CopyTradersProfile);
