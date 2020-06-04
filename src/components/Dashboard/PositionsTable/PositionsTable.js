import React, { useState } from "react";
import { isEmpty } from "lodash";
import "./PositionsTable.scss";
import { Box } from "@material-ui/core";
import Table from "../../Table";
import { ConfirmDialog } from "../../Dialogs";
import {
  composeOpenPositionsDataTable,
  composeClosePositionsDataTable,
  composeLogPositionsDataTable,
} from "../../../utils/composePositionsDataTable";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import PositionFilters from "../PositionFilters";
import NoPositions from "../NoPositions";
import usePositionsList from "../../../hooks/usePositionsList";

/**
 * @typedef {import("../../../services/tradeApiClient.types").UserPositionsCollection} UserPositionsCollection
 * @typedef {import("../../../utils/composePositionsDataTable").DataTableContent} DataTableContent
 * @typedef {import("../../../hooks/usePositionsList").PositionsCollectionType} PositionsCollectionType
 * @typedef {Object} PositionsTableProps
 * @property {PositionsCollectionType} type
 */

/**
 * Component that display user positions in table view.
 *
 * @param {PositionsTableProps} props Component properties.
 * @returns {JSX.Element} Positions table element.
 */
const PositionsTable = (props) => {
  const { type } = props;
  const storeSession = useStoreSessionSelector();
  const { positionsAll, positionsFiltered, setFilters } = usePositionsList(type);
  const showTypesFilter = type === "log";
  const tablePersistsKey = `${type}Positions`;

  /**
   * @typedef {import("../../Dialogs/ConfirmDialog/ConfirmDialog").ConfirmDialogConfig} ConfirmDialogConfig
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
    if (type === "closed") {
      return composeClosePositionsDataTable(positionsFiltered);
    }

    if (type === "log") {
      return composeLogPositionsDataTable(positionsFiltered);
    }

    return composeOpenPositionsDataTable(positionsFiltered, confirmAction);
  };

  const { columns, data } = composeDataTableForPositionsType();

  const embedFilters = (
    <PositionFilters
      onChange={setFilters}
      positions={positionsAll}
      showTypesFilter={showTypesFilter}
    />
  );

  return (
    <>
      <ConfirmDialog
        confirmConfig={confirmConfig}
        executeActionCallback={executeAction}
        setConfirmConfig={setConfirmConfig}
      />

      {isEmpty(positionsFiltered) ? (
        <NoPositions />
      ) : (
        <Box className="positionsTable" display="flex" flexDirection="column" width={1}>
          <Table columns={columns} data={data} persistKey={tablePersistsKey} title={embedFilters} />
        </Box>
      )}
    </>
  );
};

export default PositionsTable;
