import React, { useState } from "react";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import Table from "../../../../Table";
import { ConfirmDialog } from "../../../../Dialogs";
import tradeApi from "../../../../../services/tradeApiClient";
import ExpandedRow from "../ExpandedRow";
import { showErrorAlert, showSuccessAlert } from "../../../../../store/actions/ui";
import { usePositionDataTableCompose } from "../../../../../hooks/usePositionsDataTableCompose";
import "./ManagementTable.scss";
import SelectionActions from "../ExpandedRow/SelectionActions";
import useSelectedExchange from "hooks/useSelectedExchange";

/**
 * @typedef {import("../../../../../services/tradeApiClient.types").UserPositionsCollection} UserPositionsCollection
 * @typedef {import("../../../../../utils/composePositionsDataTable").DataTableContent} DataTableContent
 * @typedef {import("../../../../../services/tradeApiClient.types").ManagementPositionsEntity} ManagementPositionsEntity
 * @typedef {import("../../../../../services/tradeApiClient.types").DefaultProviderGetObject} DefaultProviderGetObject
 * @typedef {import("mui-datatables").MUIDataTableOptions} MUIDataTableOptions
 */

/**
 * @typedef {Object} PositionsTableProps
 * @property {Array<Position>} list
 * @property {Array<ManagementPositionsEntity>} allPositions
 * @property {React.SetStateAction<*>} setLoading
 * @property {DefaultProviderGetObject} provider
 */

/**
 * Component that display user positions in table view.
 *
 * @param {PositionsTableProps} props Component properties.
 * @returns {JSX.Element} Positions table element.
 */
const ManagementTable = ({ list, allPositions, setLoading, provider }) => {
  const tablePersistsKey = "managementPositions";
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const selectedExchange = useSelectedExchange();

  /**
   * @typedef {import("../../../../Dialogs/ConfirmDialog/ConfirmDialog").ConfirmDialogConfig} ConfirmDialogConfig
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

    if (action === "abort") {
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
    if (action === "abort") {
      tradeApi
        .positionCancel({
          positionId: positionId,
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
          // todo: check
          internalExchangeId: selectedExchange.internalId,
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

  const { composeManagementPositionsDataTable, excludeDataTableColumn } =
    usePositionDataTableCompose(list, confirmAction);

  /**
   * Compose MUI data table for positions collection of selected type.
   *
   * @returns {DataTableContent} Data table content.
   */
  const composeDataTableForPositionsType = () => {
    let dataTable;

    dataTable = composeManagementPositionsDataTable();
    if (provider.profitSharing) {
      dataTable = excludeDataTableColumn(dataTable, "col.provider.subpositions");
      dataTable = excludeDataTableColumn(dataTable, "col.provider.totalpositions");
      dataTable = excludeDataTableColumn(dataTable, "col.provider.soldpositions");
    }
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
        onAllSelection={selectAllChild}
        onSelectionChange={handleRowSelectionChange}
        persistKey={tablePersistsKey}
        selectedRows={selectedRows}
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
      indexes.push(item.dataIndex);
    });
    setExpanded(indexes);
  };

  /**
   *
   * @param {Number} index Index of parent row.
   * @param {String} id Position ID.
   * @returns {Void} None.
   */
  const handleRowSelectionChange = (index, id) => {
    const subPositions = allPositions[index].subPositions;
    const position = subPositions.find((item) => item.positionId === id);
    let dataList = [...selectedRows];
    if (dataList.includes(id)) {
      dataList = dataList.filter((item) => item !== id);
    } else if (position && !position.updating) {
      dataList.push(id);
    }
    setSelectedRows(dataList);
  };

  /**
   *
   * @param {Number} index index of the parent.
   * @param {Boolean} checked Flag to indicate the status of all child selection checkbox.
   * @returns {Void} Nobe.
   */
  const selectAllChild = (index, checked) => {
    const subPositions = allPositions[index].subPositions;
    if (checked) {
      let dataList = [...selectedRows];
      subPositions.forEach((position) => {
        if (!position.updating) {
          dataList.push(position.positionId);
        }
      });
      dataList = [...new Set(dataList)];
      setSelectedRows(dataList);
    } else {
      let dataList = [...selectedRows];
      subPositions.forEach((position) => {
        dataList = dataList.filter((listItem) => listItem !== position.positionId);
      });
      setSelectedRows(dataList);
    }
  };

  /**
   * @type {MUIDataTableOptions}
   */
  const options = {
    expandableRows: !provider.profitSharing,
    renderExpandableRow: renderRow,
    rowsExpanded: expanded,
    onRowExpansionChange: handleRowExpansionChange,
    expandableRowsHeader: false,
    sortOrder: {
      name: "col.date.open",
      direction: "desc",
    },
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
          options={options}
          persistKey={tablePersistsKey}
          title={
            !provider.profitSharing ? (
              <SelectionActions
                selectedRows={selectedRows}
                setLoading={setLoading}
                setSelectedRows={setSelectedRows}
                values={allPositions}
              />
            ) : (
              ""
            )
          }
        />
      </Box>
    </>
  );
};

export default ManagementTable;
