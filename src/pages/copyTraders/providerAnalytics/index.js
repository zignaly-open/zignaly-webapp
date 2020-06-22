import React, { useState, useEffect } from "react";
import "./providerAnalytics.scss";
import { Box, Typography, CircularProgress } from "@material-ui/core";
import withProviderLayout from "../../../layouts/providerLayout";
import { compose } from "recompose";
import { FormattedMessage } from "react-intl";
import CopiersGraph from "../../../components/Provider/Analytics/CopiersGraph";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";
import GraphLabels from "../../../components/Balance/TotalEquity/GraphLabels";
import MoreInfo from "../../../components/Provider/Analytics/MoreInfo";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../../../store/actions/ui";

const CopyTradersAnalytics = () => {
  const storeSession = useStoreSessionSelector();
  const storeViews = useStoreViewsSelector();
  const [followers, setFollowers] = useState([]);
  const dispatch = useDispatch();
  const [copiersLoading, setCopiersLoading] = useState(false);

  const getProviderFollowers = () => {
    setCopiersLoading(true);
    const payload = {
      token: storeSession.tradeApi.accessToken,
      providerId: storeViews.provider.id,
    };
    tradeApi
      .providerFollowersGet(payload)
      .then((response) => {
        setFollowers(response);
        setCopiersLoading(false);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };

  useEffect(getProviderFollowers, []);

  return (
    <Box className="profileAnalyticsPage">
      <Box bgcolor="grid.main" className="tradingPerformanceBox">
        <Typography variant="h3">
          <FormattedMessage id="copyt.tradingperformance" />
        </Typography>
      </Box>

      <Box bgcolor="grid.main" className="copiersBox">
        <Typography variant="h3">
          <FormattedMessage id="trader.people" />
        </Typography>
        <Box
          className="graphBox"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          {copiersLoading && <CircularProgress size={50} color="primary" />}
          {!copiersLoading && (
            <>
              <CopiersGraph list={followers} />
              <GraphLabels list={followers} />
            </>
          )}
        </Box>
      </Box>

      <Box bgcolor="grid.main" className="moreInfoBox">
        <MoreInfo provider={storeViews.provider} />
      </Box>
    </Box>
  );
};

export default compose(withProviderLayout)(CopyTradersAnalytics);
