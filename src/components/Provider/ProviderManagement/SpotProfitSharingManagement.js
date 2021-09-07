import React, { useState } from "react";
import { Box, CircularProgress } from "@material-ui/core";
import { SpotProfitSharingSummary } from "./ManagementSummary";
import ManagementTabs from "./ManagementTabs";
import tradeApi from "../../../services/tradeApiClient";
import { showErrorAlert } from "../../../store/actions/ui";
import useInterval from "../../../hooks/useInterval";
import { useDispatch } from "react-redux";

/**
 * @typedef {import("../../../services/tradeApiClient.types").PositionEntity} PositionEntity
 * @typedef {import("../../../services/tradeApiClient.types").ManagementPositionsEntity} ManagementPositionsEntity
 * @typedef {import("../../../services/tradeApiClient.types").ExchangeConnectionEntity} ExchangeConnectionEntity
 * @typedef {import("../../../services/tradeApiClient.types").DefaultProviderGetObject} DefaultProviderGetObject
 * @typedef {Object} DefaultProps
 * @property {DefaultProviderGetObject} provider provider object.
 * @property {ExchangeConnectionEntity} selectedExchange selected exchange object.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const SpotProfitSharingManagement = ({ provider, selectedExchange }) => {
  const [tablePositions, setTablePositions] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const loadBalanceAndPositions = () => {
    if (provider.id) {
      const payload = {
        providerId: provider.id,
      };
      tradeApi
        .providerManagementBalanceAndPositions(payload)
        .then((response) => {
          setLoading(false);
          setData(response);
          setTablePositions(prepareTableList(response.positions));
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        });
    }
  };

  useInterval(loadBalanceAndPositions, 5000, true);

  /**
   * Function to prepare list of the table.
   *
   * @param {Array<ManagementPositionsEntity>} positions transformed data from backend.
   * @returns {Array<PositionEntity>} Array of position entities.
   */
  const prepareTableList = (positions) => {
    /**
     * @type {Array<PositionEntity>}
     */
    let list = [];
    positions.forEach((item) => {
      list.push(item.position);
    });
    return list;
  };

  return (
    <>
      {(loading || !data) && (
        <Box
          alignItems="center"
          className="loadingBox"
          display="flex"
          flexDirection="row"
          justifyContent="center"
        >
          <CircularProgress color="primary" size={35} />
        </Box>
      )}
      {!loading && data && (
        <>
          <Box className="summaryBox">
            <SpotProfitSharingSummary provider={provider} summary={data.balance} />
          </Box>

          <Box className="tableBoxBox">
            <ManagementTabs
              allPositions={data.positions}
              loadData={() => setLoading(true)}
              provider={provider}
              selectedExchange={selectedExchange}
              tablePositions={tablePositions}
            />
          </Box>
        </>
      )}
    </>
  );
};

export default SpotProfitSharingManagement;
