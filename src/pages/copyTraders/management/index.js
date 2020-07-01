import React, { useState, useEffect } from "react";
import "./management.scss";
import { Box, CircularProgress } from "@material-ui/core";
import withProviderLayout from "../../../layouts/providerLayout";
import { compose } from "recompose";
import { creatEmptyProviderDataPointsEntity } from "../../../services/tradeApiClient.types";
import ManagementSummary from "../../../components/Provider/Management/ManagementSummary";
import ManagementTable from "../../../components/Provider/Management/ManagementTable";
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
  const [tablePositions, setTablePositions] = useState([]);
  const [allPositions, setAllPositions] = useState({});
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [positionsLoading, setPositionsLoading] = useState(false);
  const dispatch = useDispatch();

  const loadSummary = () => {
    if (storeViews.provider.id) {
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
    }
  };

  useEffect(loadSummary, [storeViews.provider.id]);

  const loadPositions = () => {
    if (storeViews.provider.id) {
      setPositionsLoading(true);
      const payload = {
        token: storeSession.tradeApi.accessToken,
        providerId: storeViews.provider.id,
      };
      tradeApi
        .providerManagementPositions(payload)
        .then((response) => {
          setPositionsLoading(false);
          setAllPositions(response);
          setTablePositions(prepareTableList(response));
        })
        .catch((e) => {
          console.log(e);
          dispatch(showErrorAlert(e));
        });
    }
  };

  useEffect(loadPositions, [storeViews.provider.id]);

  /**
   *
   * @param {Object} data
   * @returns {Array<*>}
   */
  const prepareTableList = (data) => {
    /**
     * @type {*}
     */
    let list = [];
    Object.keys(data).forEach((item) => {
      /*@ts-ignore */
      let innerList = data[item];
      list.push(innerList[0]);
      innerList.splice(0, 1);
    });
    return list;
  };

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
        {!positionsLoading && <ManagementTable list={tablePositions} allPositions={allPositions} />}
      </Box>
    </Box>
  );
};

export default compose(withProviderLayout)(CopyTradersProfile);
