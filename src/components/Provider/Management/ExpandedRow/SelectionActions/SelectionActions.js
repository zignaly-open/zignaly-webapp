import React from "react";
import "./SelectionActions.scss";
import { Box } from "@material-ui/core";
import CustomButton from "../../../../CustomButton";
import { useDispatch } from "react-redux";
import { showSuccessAlert, showErrorAlert } from "../../../../../store/actions/ui";
import tradeApi from "../../../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../../../hooks/useStoreSessionSelector";

/**
 *
 * @typedef {import('../../../../../services/tradeApiClient.types').ManagementPositionsEntity} ManagementPositionsEntity
 * @typedef {Object} DefaultProps
 * @property {Array<ManagementPositionsEntity>} [values]
 * @property {Array<String>} selectedRows
 * @property {React.SetStateAction<*>} setSelectedRows
 * @property {React.SetStateAction<*>} setLoading
 */

/**
 * Expanded rows component for management table.
 *
 * @param {DefaultProps} props Default component props.
 * @returns {JSX.Element} JSX component.
 */
const SelectionActions = ({ selectedRows, setSelectedRows, setLoading }) => {
  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();

  /**
   *
   * @param {String} action Type of action to execute.
   * @returns {Void} None.
   */
  const executeAction = (action) => {
    setLoading(true);
    /**
     * @type {Array<Promise<*>>}
     */
    let promiseArray = [];
    const list = [...selectedRows];
    if (action === "abort") {
      list.forEach((item) => {
        let payload = {
          token: storeSession.tradeApi.accessToken,
          positionId: item,
        };
        let promise = tradeApi.positionCancel(payload);
        promiseArray.push(promise);
      });
    }
    if (action === "exit") {
      list.forEach((item) => {
        let payload = {
          token: storeSession.tradeApi.accessToken,
          positionId: item,
        };
        let promise = tradeApi.positionExit(payload);
        promiseArray.push(promise);
      });
    }

    Promise.all(promiseArray)
      .then(() => {
        if (action === "abort") {
          dispatch(
            showSuccessAlert("alert.management.cancelall.title", "alert.management.cancelall.body"),
          );
        }
        if (action === "abort") {
          dispatch(
            showSuccessAlert("alert.management.exitall.title", "alert.management.exitall.body"),
          );
        }
        setSelectedRows([]);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };

  return (
    <Box
      alignItems="center"
      className="selectionActions"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
    >
      <CustomButton
        className="textPurple"
        disabled={!selectedRows.length}
        onClick={() => executeAction("abort")}
      >
        Cancel Entries
      </CustomButton>
      <CustomButton
        className="textPurple"
        disabled={!selectedRows.length}
        onClick={() => executeAction("exit")}
      >
        Exit Entries
      </CustomButton>
    </Box>
  );
};

export default SelectionActions;
