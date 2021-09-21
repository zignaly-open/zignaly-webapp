import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "./Management.scss";
import tradeApi from "../../../../services/tradeApiClient";
import { showErrorAlert } from "../../../../store/actions/ui";
import useInterval from "../../../../hooks/useInterval";
import { Box, CircularProgress } from "@material-ui/core";
import ManagementTable from "./ManagementTable";

/**
 * @typedef {import("../../../../services/tradeApiClient.types").ManagementPositionsEntity} ManagementPositionsEntity
 * @typedef {import("../../../../services/tradeApiClient.types").DefaultProviderGetObject} DefaultProviderGetObject
 * @typedef {Object} DefaultProps
 * @property {DefaultProviderGetObject} provider Balance
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const Management = ({ provider }) => {
  const [tablePositions, setTablePositions] = useState([]);
  const [allPositions, setAllPositions] = useState([]);
  const [positionsLoading, setPositionsLoading] = useState(true);
  const dispatch = useDispatch();

  const loadPositions = () => {
    if (provider.id) {
      const payload = {
        providerId: provider.id,
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
   * @returns {Array<Position>} Array of position entities.
   */
  const prepareTableList = (data) => {
    /**
     * @type {Array<Position>}
     */
    let list = [];
    data.forEach((item) => {
      list.push(item.position);
    });
    return list;
  };
  return (
    <>
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
      {!positionsLoading && (
        <ManagementTable
          allPositions={allPositions}
          list={tablePositions}
          provider={provider}
          setLoading={setPositionsLoading}
        />
      )}
    </>
  );
};

export default Management;
