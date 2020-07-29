import React, { useState } from "react";
import "./management.scss";
import { Box, CircularProgress } from "@material-ui/core";
import ManagementSummary from "../../../components/Provider/Management/ManagementSummary";
import ManagementTable from "../../../components/Provider/Management/ManagementTable";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import tradeApi from "../../../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../../../store/actions/ui";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import useManagementSymmary from "../../../hooks/useManagementSymmary";
import useInterval from "../../../hooks/useInterval";

/**
 *
 * @typedef {import("../../../services/tradeApiClient.types").PositionEntity} PositionEntity
 * @typedef {import("../../../services/tradeApiClient.types").ManagementPositionsEntity} ManagementPositionsEntity
 */

const CopyTradersManagement = () => {
  const storeViews = useStoreViewsSelector();
  const storeSession = useStoreSessionSelector();
  const [tablePositions, setTablePositions] = useState([]);
  const [allPositions, setAllPositions] = useState([]);
  const [positionsLoading, setPositionsLoading] = useState(true);
  const dispatch = useDispatch();
  const intl = useIntl();
  const { summaryLoading, summary } = useManagementSymmary(storeViews.provider.id);

  const loadPositions = () => {
    if (storeViews.provider.id) {
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
          dispatch(showErrorAlert(e));
        });
    }
  };

  useInterval(loadPositions, 5000, true);

  /**
   * Function to prepare list of the table.
   *
   * @param {Array<ManagementPositionsEntity>} data default data from backend.
   * @returns {Array<PositionEntity>} Array of position entities.
   */
  const prepareTableList = (data) => {
    /**
     * @type {Array<PositionEntity>}
     */
    let list = [];
    data.forEach((item) => {
      list.push(item.position);
    });
    return list;
  };

  return (
    <Box className="profileManagementPage">
      <Helmet>
        <title>
          {`${storeViews.provider.name} - ${intl.formatMessage({
            id: "srv.management",
          })} | ${intl.formatMessage({ id: "product" })}`}
        </title>
      </Helmet>
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
        {!positionsLoading && <ManagementTable allPositions={allPositions} list={tablePositions} />}
      </Box>
    </Box>
  );
};

export default CopyTradersManagement;
