import React, { useState } from "react";
import { isEmpty } from "lodash";
import { Box, CircularProgress } from "@material-ui/core";
import { useDispatch } from "react-redux";
import Table from "../../Table";
import { ConfirmDialog } from "../../Dialogs";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import PositionFilters from "../PositionFilters";
import NoPositions from "../NoPositions";
import usePositionsList from "../../../hooks/usePositionsList";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import { showErrorAlert, showSuccessAlert } from "../../../store/actions/ui";
import { usePositionDataTableCompose } from "../../../hooks/usePositionsDataTableCompose";
import { useStoreUserData } from "../../../hooks/useStoreUserSelector";
import "./PositionsTable.scss";
import { useIntl } from "react-intl";

/**
 * @typedef {import("../../../services/tradeApiClient.types").UserPositionsCollection} UserPositionsCollection
 * @typedef {import("../../../utils/composePositionsDataTable").DataTableContent} DataTableContent
 * @typedef {import("../../../hooks/usePositionsList").PositionsCollectionType} PositionsCollectionType
 * @typedef {import("../../../services/tradeApiClient.types").PositionEntity} PositionEntity
 * @typedef {import("../../../services/tradeApiClient.types").DefaultProviderGetObject} ProviderEntity
 */

/**
 * @typedef {Object} PositionsTableProps
 * @property {PositionsCollectionType} type
 * @property {PositionEntity} [positionEntity]
 * @property {function} [notifyPositionsUpdate]
 * @property {Boolean} [isProfile]
 */

/**
 * Component that display user positions in table view.
 *
 * @param {PositionsTableProps} props Component properties.
 * @returns {JSX.Element} Positions table element.
 */
const PositionsTable = (props) => {
  const { type, isProfile, positionEntity = null, notifyPositionsUpdate = null } = props;
  const storeSession = useStoreSessionSelector();
  const storeSettings = useStoreSettingsSelector();
  const userData = useStoreUserData();
  const dispatch = useDispatch();
  const {
    flagPositionUpdating,
    positionsAll,
    positionsFiltered,
    setFilters,
    filtersState,
    loading,
  } = usePositionsList(type, positionEntity, notifyPositionsUpdate);
  const showTypesFilter = type === "log";
  const { formatMessage } = useIntl();

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

    if (action === "abort") {
      setConfirmConfig({
        titleTranslationId: "confirm.positionabort.title",
        messageTranslationId: "confirm.positionabort.message",
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
    flagPositionUpdating(positionId);

    if (action === "cancel") {
      tradeApi
        .positionClose({
          positionId: positionId,
          token: storeSession.tradeApi.accessToken,
        })
        .then(() => {
          dispatch(showSuccessAlert("", "dashboard.positions.action.cancel"));
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        });
    }

    if (action === "abort") {
      tradeApi
        .positionCancel({
          positionId: positionId,
          token: storeSession.tradeApi.accessToken,
        })
        .then(() => {
          dispatch(showSuccessAlert("", "dashboard.positions.action.abort"));
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
        .then(() => {
          dispatch(showSuccessAlert("", "dashboard.positions.action.exit"));
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        });
    }
  };

  const {
    composeClosePositionsDataTable,
    composeLogPositionsDataTable,
    composeOpenPositionsDataTable,
    composeOpenPositionsForProvider,
    composeClosedPositionsForProvider,
    excludeDataTableColumn,
  } = usePositionDataTableCompose(positionsFiltered, confirmAction);

  /**
   * Compose MUI data table for positions collection of selected type.
   *
   * @returns {DataTableContent} Data table content.
   */
  const composeDataTableForPositionsType = () => {
    let dataTable;

    const excludeCancelAction = () => {
      const isFutures =
        storeSettings.selectedExchange.exchangeType.toLocaleLowerCase() === "futures";
      const isZignaly = storeSettings.selectedExchange.exchangeName.toLowerCase() === "zignaly";

      return isZignaly && isFutures;
    };

    if (type === "closed") {
      dataTable = composeClosePositionsDataTable();
    } else if (type === "log") {
      dataTable = composeLogPositionsDataTable();
    } else if (type === "open") {
      dataTable = composeOpenPositionsDataTable();
      if (excludeCancelAction()) {
        dataTable = excludeDataTableColumn(dataTable, "col.cancel");
      }
    } else if (type === "profileOpen") {
      dataTable = composeOpenPositionsForProvider(positionsAll, confirmAction);
      dataTable = excludeDataTableColumn(dataTable, "col.actions");
      if (excludeCancelAction()) {
        dataTable = excludeDataTableColumn(dataTable, "col.cancel");
      }
    } else if (type === "profileClosed") {
      dataTable = composeClosedPositionsForProvider(positionsAll);
    } else {
      throw new Error(formatMessage({ id: "dashboard.positions.type.invalid" }));
    }

    if (positionEntity) {
      const isProviderOwner = userData.userId === positionEntity.providerOwnerUserId;
      if (["closed", "log"].includes(type)) {
        // Exclude actions display for closed / log positions in view page.
        dataTable = excludeDataTableColumn(dataTable, "col.actions");
      } else if (type === "open" && positionEntity.isCopyTrading && !isProviderOwner) {
        // Exclude actions on copy trading open position, except for the owner.
        dataTable = excludeDataTableColumn(dataTable, "col.actions");
      }
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
        initialState={filtersState}
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
