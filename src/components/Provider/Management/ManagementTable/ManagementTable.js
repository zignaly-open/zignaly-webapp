import React, { useState } from "react";
import "./ManagementTable.scss";
import { Box } from "@material-ui/core";
import Table from "../../../Table";
import { ConfirmDialog } from "../../../Dialogs";
import { composeManagementPositionsDataTable } from "../../../../utils/composePositionsDataTable";
import tradeApi from "../../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import ExpandedRow from "../ExpandedRow";

/**
 * @typedef {import("../../../../services/tradeApiClient.types").UserPositionsCollection} UserPositionsCollection
 * @typedef {import("../../../../utils/composePositionsDataTable").DataTableContent} DataTableContent
 * @typedef {import("../../../../services/tradeApiClient.types").PositionEntity} PositionEntity
 */

/**
 * @typedef {Object} PositionsTableProps
 * @property {Array<PositionEntity>} list
 * @property {Object} allPositions
 */

/**
 * Component that display user positions in table view.
 *
 * @param {PositionsTableProps} props Component properties.
 * @returns {JSX.Element} Positions table element.
 */
const ManagementTable = ({ list, allPositions }) => {
  const storeSession = useStoreSessionSelector();
  const tablePersistsKey = `managementPositions`;

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
          alert(`Position ${position.positionId} was cancelled.`);
        })
        .catch((e) => {
          alert(`Cancel position failed: ${e.message}`);
        });
    }

    if (action === "exit") {
      tradeApi
        .positionExit({
          positionId: positionId,
          token: storeSession.tradeApi.accessToken,
        })
        .then((position) => {
          alert(`Position ${position.positionId} was exited.`);
        })
        .catch((e) => {
          alert(`Exit position failed: ${e.message}`);
        });
    }
  };

  /**
   * Compose MUI data table for positions collection of selected type.
   *
   * @returns {DataTableContent} Data table content.
   */
  const composeDataTableForPositionsType = () => {
    let dataTable;
    dataTable = composeManagementPositionsDataTable(list, confirmAction);
    return dataTable;
  };

  const { columns, data } = composeDataTableForPositionsType();

  /**
   *
   * @param {*} data
   * @param {*} rowMeta
   */
  const renderRow = (data, rowMeta) => {
    return (
      <ExpandedRow
        values={allPositions}
        persistKey={tablePersistsKey}
        confirmAction={confirmAction}
        index={rowMeta.dataIndex}
      />
    );
  };

  const customOptions = {
    expandableRows: true,
    renderExpandableRow: renderRow,
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
          options={customOptions}
          data={data}
          persistKey={tablePersistsKey}
          title=""
        />
      </Box>
    </>
  );
};

export default ManagementTable;
