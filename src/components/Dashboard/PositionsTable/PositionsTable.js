import React, { useContext, useState } from "react";
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
import PositionsContext from "../PositionsContext";
import Modal from "../../Modal";
import MarginModal from "./MarginModal";

/**
 * @typedef {import("../../../services/tradeApiClient.types").UserPositionsCollection} UserPositionsCollection
 * @typedef {import("../../../utils/composePositionsDataTable").DataTableContent} DataTableContent
 * @typedef {import("../../../hooks/usePositionsList").PositionsCollectionType} PositionsCollectionType
 * @typedef {import("../../../services/tradeApiClient.types").PositionEntity} PositionEntity
 * @typedef {import("../../../services/tradeApiClient.types").DefaultProviderGetObject} ProviderEntity
 * @typedef {import("mui-datatables").MUIDataTableOptions} MUIDataTableOptions
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
  const { setOpenCount, setCloseCount, setLogCount } = useContext(PositionsContext);
  const storeSession = useStoreSessionSelector();
  const { selectedExchange } = useStoreSettingsSelector();
  const userData = useStoreUserData();
  const dispatch = useDispatch();
  const persistKey = !isProfile && !positionEntity ? "dashboardPositions" : null;
  const {
    flagPositionUpdating,
    positionsAll,
    positionsFiltered,
    setFilters,
    filters,
    loading,
    filtersVisibility,
    setFiltersVisibility,
    clearFilters,
    providerOptions,
    pairOptions,
    types,
    sides,
    modifiedFilters,
  } = usePositionsList(type, positionEntity, notifyPositionsUpdate, persistKey);
  // Show option to display all error logs for admins
  const showTypesFilter = type === "log" && userData.isAdmin;
  const { formatMessage } = useIntl();
  const [marginPosition, setMarginPosition] = useState(null);

  const toggleFilters = () => {
    setFiltersVisibility(!filtersVisibility);
  };

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

  /**
   * @param {string} positionId .
   * @returns {void}
   */
  const openMarginModal = (positionId) => {
    setMarginPosition(positionId);
  };

  const {
    composeClosePositionsDataTable,
    composeLogPositionsDataTable,
    composeOpenPositionsDataTable,
    composeOpenPositionsForProvider,
    composeClosedPositionsForProvider,
    excludeDataTableColumn,
  } = usePositionDataTableCompose(positionsFiltered, confirmAction, openMarginModal);

  /**
   *
   * @param {UserPositionsCollection} allPositions positions collection.
   * @returns {Number} count of positions in last 24 hour.
   */
  const pastDayPositionsCount = (allPositions) => {
    const last24HoursTime = new Date().getTime() - 60 * 60 * 24 * 1000;
    const filtered = allPositions.filter((item) => item.closeDate >= last24HoursTime);
    return filtered.length;
  };

  /**
   *
   * @param {string} countType Which type of count to configure
   * @param {number} count Count value.
   * @returns {void} None.
   */
  const configureCounts = (countType, count) => {
    if (setOpenCount && setCloseCount && setLogCount) {
      switch (countType) {
        case "open":
          setOpenCount(count);
          break;
        case "close":
          setCloseCount(count);
          break;
        case "log":
          setLogCount(count);
          break;
        default:
          setOpenCount(count);
          break;
      }
    }
  };

  /**
   * Compose MUI data table for positions collection of selected type.
   *
   * @returns {DataTableContent} Data table content.
   */
  const composeDataTableForPositionsType = () => {
    let dataTable;
    const isFutures = selectedExchange.exchangeType.toLowerCase() === "futures";
    const isZignaly = selectedExchange.exchangeName.toLowerCase() === "zignaly";
    const isBitmex = selectedExchange.exchangeName.toLowerCase() === "bitmex";
    const isDemo = selectedExchange.paperTrading;
    const isTestnet = selectedExchange.isTestnet;

    if (type === "closed") {
      dataTable = composeClosePositionsDataTable();
      configureCounts("close", pastDayPositionsCount(positionsAll));
    } else if (type === "log") {
      dataTable = composeLogPositionsDataTable();
      configureCounts("log", positionsAll.length);
    } else if (type === "open") {
      dataTable = composeOpenPositionsDataTable();
      if (isDemo || isTestnet || !isFutures) {
        dataTable = excludeDataTableColumn(dataTable, "col.price.market");
        dataTable = excludeDataTableColumn(dataTable, "col.price.liquid");
      }
      if (!isBitmex) {
        dataTable = excludeDataTableColumn(dataTable, "col.margin");
      }
      configureCounts("open", positionsAll.length);
    } else if (type === "profileOpen") {
      dataTable = composeOpenPositionsForProvider(positionsAll, confirmAction);
      dataTable = excludeDataTableColumn(dataTable, "col.actions");
      if (isZignaly && isFutures) {
        dataTable = excludeDataTableColumn(dataTable, "col.cancel");
      }
      configureCounts("open", positionsAll.length);
    } else if (type === "profileClosed") {
      dataTable = composeClosedPositionsForProvider(positionsAll);
      configureCounts("close", pastDayPositionsCount(positionsAll));
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

  /**
   * @type {MUIDataTableOptions}
   */
  const options = {
    sortOrder: { name: "openDateReadable", direction: "desc" },
  };

  const embedFilters = () => {
    // Don't display filters on single position display.
    if (positionEntity) {
      return null;
    }

    if (isProfile) {
      return null;
    }

    if (!filtersVisibility) {
      return null;
    }

    return (
      <PositionFilters
        clearFilters={clearFilters}
        filters={filters}
        onChange={setFilters}
        pairOptions={pairOptions}
        providerOptions={providerOptions}
        showTypesFilter={showTypesFilter}
        sides={sides}
        types={types}
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
      <Modal
        onClose={() => setMarginPosition(null)}
        persist={false}
        size="mini"
        state={Boolean(marginPosition)}
      >
        {marginPosition && (
          <MarginModal onClose={() => setMarginPosition(null)} position={marginPosition} />
        )}
      </Modal>

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
                modifiedFiltersCount={modifiedFilters}
                options={options}
                persistKey={tablePersistsKey}
                title={embedFilters()}
                toggleFilters={toggleFilters}
              />
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default PositionsTable;
