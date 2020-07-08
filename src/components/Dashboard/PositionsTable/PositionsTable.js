import React, { useState } from "react";
import { isEmpty } from "lodash";
import "./PositionsTable.scss";
import { Box, CircularProgress } from "@material-ui/core";
import Table from "../../Table";
import { ConfirmDialog } from "../../Dialogs";
import {
  composeOpenPositionsDataTable,
  composeClosePositionsDataTable,
  composeLogPositionsDataTable,
  excludeDataTableColumn,
  composeClosedPositionsForProvider,
  composeOpenPositionsForProvider,
} from "../../../utils/composePositionsDataTable";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import PositionFilters from "../PositionFilters";
import NoPositions from "../NoPositions";
import usePositionsList from "../../../hooks/usePositionsList";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";

/**
 * @typedef {import("../../../services/tradeApiClient.types").UserPositionsCollection} UserPositionsCollection
 * @typedef {import("../../../utils/composePositionsDataTable").DataTableContent} DataTableContent
 * @typedef {import("../../../hooks/usePositionsList").PositionsCollectionType} PositionsCollectionType
 * @typedef {import("../../../services/tradeApiClient.types").PositionEntity} PositionEntity
 */

/**
 * @typedef {Object} PositionsTableProps
 * @property {PositionsCollectionType} type
 * @property {PositionEntity} [positionEntity]
 * @property {Boolean} [isProfile]
 */

/**
 * Component that display user positions in table view.
 *
 * @param {PositionsTableProps} props Component properties.
 * @returns {JSX.Element} Positions table element.
 */
const PositionsTable = (props) => {
  const { type, isProfile, positionEntity = null } = props;
  const storeSession = useStoreSessionSelector();
  const storeSettings = useStoreSettingsSelector();
  const { positionsAll, positionsFiltered, setFilters, loading } = usePositionsList(
    type,
    positionEntity,
  );
  const showTypesFilter = type === "log";

  const getTablePersistKey = () => {
    // Use different persist key to edit position table to support different default columns.
    if (type === "open" && positionEntity) {
      return `${type}EditPositions`;
    }

    return `${type}Positions`;
  };
  const tablePersistsKey = getTablePersistKey();

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
    let dataTable;

    if (type === "closed") {
      dataTable = composeClosePositionsDataTable(positionsFiltered);
    } else if (type === "log") {
      dataTable = composeLogPositionsDataTable(positionsFiltered);
    } else if (type === "open") {
      dataTable = composeOpenPositionsDataTable(positionsFiltered, confirmAction);
      if (storeSettings.selectedExchange.exchangeType === "futures") {
        dataTable = excludeDataTableColumn(dataTable, "col.cancel");
      }

      // Exclude status for non edit position page.
      if (!positionEntity) {
        dataTable = excludeDataTableColumn(dataTable, "col.stat");
      }
    } else if (type === "profileOpen") {
      dataTable = composeOpenPositionsForProvider(positionsAll, confirmAction);
      if (storeSettings.selectedExchange.exchangeType === "futures") {
        dataTable = excludeDataTableColumn(dataTable, "col.cancel");
      }
    } else if (type === "profileClosed") {
      dataTable = composeClosedPositionsForProvider(positionsAll);
    } else {
      throw new Error(`Invalid positions collection type: ${type}`);
    }

    return dataTable;
  };

  const { columns, data } = composeDataTableForPositionsType();

  const embedFilters = () => {
    // Don't display filters on single position display.
    if (positionEntity) {
      return null;
    }

    if (isProfile) {
      return null;
    }

    return (
      <PositionFilters
        onChange={setFilters}
        positions={positionsAll}
        showTypesFilter={showTypesFilter}
      />
    );
  };

  const tableClass = positionEntity ? "positionTable" : "positionsTable";

  return (
    <>
      <ConfirmDialog
        confirmConfig={confirmConfig}
        executeActionCallback={executeAction}
        setConfirmConfig={setConfirmConfig}
      />

      {loading && (
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
      {!loading && (
        <>
          {isEmpty(positionsAll) ? (
            <NoPositions isProfile={isProfile} type={type} />
          ) : (
            <Box className={tableClass} display="flex" flexDirection="column" width={1}>
              <Table
                columns={columns}
                data={data}
                persistKey={tablePersistsKey}
                title={embedFilters()}
              />
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default PositionsTable;
