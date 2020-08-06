import React, { useState } from "react";
import { Box } from "@material-ui/core";
import { useDispatch } from "react-redux";
import Table from "../../../Table";
import { ConfirmDialog } from "../../../Dialogs";
import tradeApi from "../../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import ExpandedRow from "../ExpandedRow";
import { showErrorAlert, showSuccessAlert } from "../../../../store/actions/ui";
import { usePositionDataTableCompose } from "../../../../hooks/usePositionsDataTableCompose";
import "./ManagementTable.scss";

/**
 * @typedef {import("../../../../services/tradeApiClient.types").UserPositionsCollection} UserPositionsCollection
 * @typedef {import("../../../../utils/composePositionsDataTable").DataTableContent} DataTableContent
 * @typedef {import("../../../../services/tradeApiClient.types").PositionEntity} PositionEntity
 * @typedef {import("../../../../services/tradeApiClient.types").ManagementPositionsEntity} ManagementPositionsEntity
 */

/**
 * @typedef {Object} PositionsTableProps
 * @property {Array<PositionEntity>} list
 * @property {Array<ManagementPositionsEntity>} allPositions
 */

/**
 * Component that display user positions in table view.
 *
 * @param {PositionsTableProps} props Component properties.
 * @returns {JSX.Element} Positions table element.
 */
const ManagementTable = ({ list, allPositions }) => {
  const storeSession = useStoreSessionSelector();
  const tablePersistsKey = "managementPositions";
  const dispatch = useDispatch();
  const [rows, setRows] = useState([]);

  /**
   * @typedef {import("../../../Dialogs/ConfirmDialog/ConfirmDialog").ConfirmDialogConfig} ConfirmDialogConfig
   * @type {ConfirmDialogConfig} initConfirmConfig
   */
  const initConfirmConfig = {
    titleTranslationId: "",
    messageTranslationId: "",
    visible: false,
  };

  const [confirmConfig, setConfirmConfig] = useState(initConfirmConfig);
  const [actionData, setActionData] = useState({
    positionId: "",
    action: "",
  });

  /**
   * Handle action element click event.
   *
   * @param {React.MouseEvent<HTMLButtonElement>} event Action element click.
   * @returns {Void} None.
   */
  const confirmAction = (event) => {
    const targetElement = event.currentTarget;
    const positionId = targetElement.getAttribute("data-position-id");
    const action = targetElement.getAttribute("data-action");
    setActionData({
      action: action || "",
      positionId: positionId || "",
    });

    if (action === "cancel") {
      setConfirmConfig({
        titleTranslationId: "confirm.positioncancel.title",
        messageTranslationId: "confirm.positioncancel.message",
        visible: true,
      });
    }

    if (action === "exit") {
      setConfirmConfig({
        titleTranslationId: "confirm.positionexit.title",
        messageTranslationId: "confirm.positionexit.message",
        visible: true,
      });
    }
  };

  /**
   * Handle confirm dialog post confirmation, action execution.
   *
   * @returns {Void} None.
   */
  const executeAction = () => {
    const { positionId, action } = actionData;
    if (action === "cancel") {
      tradeApi
        .positionClose({
          positionId: positionId,
          token: storeSession.tradeApi.accessToken,
        })
        .then((position) => {
          dispatch(
            showSuccessAlert(
              "Position cancelled",
              `Position ${position.positionId} was cancelled.`,
            ),
          );
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        });
    }

    if (action === "exit") {
      tradeApi
        .positionExit({
          positionId: positionId,
          token: storeSession.tradeApi.accessToken,
        })
        .then((position) => {
          dispatch(
            showSuccessAlert("Position exited", `Position ${position.positionId} was exited.`),
          );
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        });
    }
  };

  const { composeManagementPositionsDataTable } = usePositionDataTableCompose(list, confirmAction);

  /**
   * Compose MUI data table for positions collection of selected type.
   *
   * @returns {DataTableContent} Data table content.
   */
  const composeDataTableForPositionsType = () => {
    let dataTable;
    dataTable = composeManagementPositionsDataTable();
    return dataTable;
  };

  const { columns, data } = composeDataTableForPositionsType();

  /**
   * Expandable row ender component
   *
   * @param {*} values data object from table
   * @param {*} rowMeta meta data of the expanded row.
   * @returns {JSX.Element} JSX component.
   */
  const renderRow = (values, rowMeta) => {
    return (
      <ExpandedRow
        confirmAction={confirmAction}
        index={rowMeta.dataIndex}
        persistKey={tablePersistsKey}
        values={allPositions}
      />
    );
  };

  /**
   *
   * @param {*} currentRowsExpanded Currently expanded rows.
   * @param {*} allRowsExpanded Currently expanded rows.
   * @returns {void} None.
   */
  const handleRowExpansionChange = (currentRowsExpanded, allRowsExpanded) => {
    /**
     * @type {Array<Number>}
     */
    let indexes = [];
    // @ts-ignore
    allRowsExpanded.forEach((item) => {
      indexes.push(item.index);
    });
    setRows(indexes);
  };

  const customOptions = {
    expandableRows: true,
    renderExpandableRow: renderRow,
    rowsExpanded: rows,
    onRowExpansionChange: handleRowExpansionChange,
    expandableRowsHeader: false,
  };

  return (
    <>
      <ConfirmDialog
        confirmConfig={confirmConfig}
        executeActionCallback={executeAction}
        setConfirmConfig={setConfirmConfig}
      />
      <Box className="managementTable" display="flex" flexDirection="column" width={1}>
        <Table
          columns={columns}
          data={data}
          options={customOptions}
          persistKey={tablePersistsKey}
          title=""
        />
      </Box>
    </>
  );
};

export default ManagementTable;
