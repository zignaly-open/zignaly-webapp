import React from "react";
import "./SelectionActions.scss";
import { Box } from "@material-ui/core";
import CustomButton from "../../../../../CustomButton";
import { useDispatch } from "react-redux";
import { showSuccessAlert, showErrorAlert } from "../../../../../../store/actions/ui";
import tradeApi from "../../../../../../services/tradeApiClient";
import useSelectedExchange from "hooks/useSelectedExchange";
import { FormattedMessage } from "react-intl";

/**
 *
 * @typedef {import('../../../../../../services/tradeApiClient.types').ManagementPositionsEntity} ManagementPositionsEntity
 * @typedef {import("../../../../../../services/tradeApiClient.types").PositionEntity} PositionEntity
 * @typedef {Object} DefaultProps
 * @property {Array<ManagementPositionsEntity>} values
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
const SelectionActions = ({ selectedRows, setSelectedRows, setLoading, values }) => {
  const selectedExchange = useSelectedExchange();
  const dispatch = useDispatch();

  /**
   * @returns {Array<PositionEntity>} Position Collection.
   */
  const getAllSelectedSubPositions = () => {
    /**
     * @type {Array<PositionEntity>}
     */
    let allSubPositions = [];
    values.forEach((item) => {
      let sub = item.subPositions;
      allSubPositions = [...allSubPositions, ...sub];
    });
    return allSubPositions.filter((item) => selectedRows.includes(item.positionId));
  };

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
    const allSelectedSubPositions = getAllSelectedSubPositions();
    if (action === "abort") {
      allSelectedSubPositions.forEach((item) => {
        if (item.status === 1) {
          let payload = {
            positionId: item.positionId,
          };
          let promise = tradeApi.positionCancel(payload);
          promiseArray.push(promise);
        }
      });
    }
    if (action === "exit") {
      allSelectedSubPositions.forEach((item) => {
        if (item.status !== 1) {
          let payload = {
            positionId: item.positionId,
            // todo: check
            internalExchangeId: selectedExchange.internalId,
          };
          let promise = tradeApi.positionExit(payload);
          promiseArray.push(promise);
        }
      });
    }

    Promise.all(promiseArray)
      .then(() => {
        if (action === "abort") {
          dispatch(
            showSuccessAlert("alert.management.cancelall.title", "alert.management.cancelall.body"),
          );
        }
        if (action === "exit") {
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

  const isDisabledCancel = () => {
    if (selectedRows.length) {
      const allSelectedSubPositions = getAllSelectedSubPositions();
      let stillEntryAvailable = false;
      allSelectedSubPositions.every((item) => {
        if (item.status === 1) {
          stillEntryAvailable = true;
          return false;
        }
        return true;
      });
      return !stillEntryAvailable;
    }
    return true;
  };

  const isDisabledExit = () => {
    if (selectedRows.length) {
      const allSelectedSubPositions = getAllSelectedSubPositions();
      let open = false;
      allSelectedSubPositions.every((item) => {
        if (item.status !== 1) {
          open = true;
          return false;
        }
        return true;
      });
      return !open;
    }
    return true;
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
        disabled={isDisabledCancel()}
        onClick={() => executeAction("abort")}
      >
        <FormattedMessage id="copyt.management.cancel" />
      </CustomButton>
      <CustomButton
        className="textPurple"
        disabled={isDisabledExit()}
        onClick={() => executeAction("exit")}
      >
        <FormattedMessage id="copyt.management.exit" />
      </CustomButton>
    </Box>
  );
};

export default SelectionActions;
