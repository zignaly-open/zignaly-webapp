import React, { useState } from "react";
import "./UsersTable.scss";
import { Box, CircularProgress, Tooltip } from "@material-ui/core";
import Table from "../../../Table";
import { FormattedMessage, useIntl } from "react-intl";
import EditIcon from "../../../../images/ct/edit.svg";
import Modal from "../../../Modal";
import ModifyUserSubscription from "../../../Forms/ModifyUserSubscription";
import { formatDate, formatFloat, formatFloat2Dec } from "../../../../utils/format";
import { ConfirmDialog } from "../../../Dialogs";
import useStoreViewsSelector from "../../../../hooks/useStoreViewsSelector";
import tradeApi from "../../../../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../../../../store/actions/ui";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { findIndex } from "lodash";

/** ]
 * @typedef {import("mui-datatables").MUIDataTableColumn} MUIDataTableColumn
 * @typedef {import("mui-datatables").MUIDataTableMeta} MUIDataTableMeta
 * @typedef {import("../../../../services/tradeApiClient.types").ProviderFollowersEntity} ProviderFollowersEntity
 * @typedef {import("../../../../services/tradeApiClient.types").DefaultProviderGetObject} DefaultProviderGetObject
 */

/**
 * Provides a table to display providers' profits stats.
 *
 * @typedef {Object} DefaultProps
 * @property {string | React.ReactNode} title Table title.
 * @property {DefaultProviderGetObject} provider Provider entity.
 * @property {string} persistKey Key to save display columns settings.
 * @property {Array<ProviderFollowersEntity>} list
 * @property {Function} loadData
 * @property {Boolean} filtersVisibility
 * @property {React.SetStateAction<*>} setFiltersVisibility
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} Component JSX.
 */
const UsersTable = ({
  title,
  provider,
  persistKey,
  list,
  loadData,
  filtersVisibility,
  setFiltersVisibility,
}) => {
  const storeViews = useStoreViewsSelector();
  const intl = useIntl();

  /**
   * @typedef {import("../../../Dialogs/ConfirmDialog/ConfirmDialog").ConfirmDialogConfig} ConfirmDialogConfig
   * @type {ConfirmDialogConfig} initConfirmConfig
   */
  const initConfirmConfig = {
    titleTranslationId: "users.cancel.title",
    messageTranslationId: "users.cancel.subtitle",
    visible: false,
  };

  const [modifyModal, showModifyModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [followerId, setFollower] = useState("");
  const [actionType, setActionType] = useState("cancel");
  const [confirmConfig, setConfirmConfig] = useState(initConfirmConfig);
  const dispatch = useDispatch();
  const excludedColumns = [
    "col.users.suspended",
    "col.users.code",
    "col.users.lasttransaction",
    "col.users.canceldate",
    "col.users.modify",
    "col.users.cancel",
  ];

  const toggleFilters = () => {
    setFiltersVisibility(!filtersVisibility);
  };

  /**
   * Format Yes/No value.
   * @param {boolean} val Val.
   * @returns {React.ReactNode} Formatted node.
   */
  const renderYesNo = (val) => (
    <span>
      {intl.formatMessage({
        id: val ? "general.yes" : "general.no",
      })}
    </span>
  );

  /**
   * @type {Array<MUIDataTableColumn>} Table columns
   */
  let columns = [
    {
      name: "userId",
      label: "col.users.userid",
    },
    {
      name: "email",
      label: "col.users.email",
    },
    {
      name: "name",
      label: "col.users.name",
    },
    {
      name: "connected",
      label: "col.users.connected",
      options: {
        display: "true",
        viewColumns: true,
        customBodyRender: renderYesNo,
      },
    },
    {
      name: "active",
      label: "col.users.active",
      options: {
        customBodyRender: renderYesNo,
      },
    },
    {
      name: "suspended",
      label: "col.users.suspended",
      options: {
        customBodyRender: renderYesNo,
      },
    },
    {
      name: "realExchangeConnected",
      label: "col.users.realexchange",
      options: {
        customBodyRender: (val) => {
          return (
            <span>
              {" "}
              {val ? (
                <FormattedMessage id="account.real" />
              ) : (
                <FormattedMessage id="account.demo" />
              )}
            </span>
          );
        },
      },
    },
    {
      name: "allocatedBalance",
      label: "col.users.allocatedbalance",
      options: {
        customBodyRender: (val) => {
          return <span>{formatFloat(val)}</span>;
        },
      },
    },
    {
      name: "profitsFromClosedBalance",
      label: "col.users.profits",
      options: {
        customBodyRender: (val) => {
          return <span>{formatFloat(val)}</span>;
        },
      },
    },
    {
      name: "code",
      label: "col.users.code",
    },
    {
      name: "lastTransactionId",
      label: "col.users.lasttransaction",
    },
    {
      name: "cancelDate",
      label: "col.users.canceldate",
      options: {
        customBodyRender: (val) => {
          return val === "-" ? val : <span>{formatDate(val, "YY/MM/DD HH:MM")}</span>;
        },
      },
    },
    {
      name: "userId",
      label: "col.users.modify",
      options: {
        customBodyRender: (val) => {
          return (
            <img
              alt="zignaly"
              className="editIcon"
              onClick={() => editSubscription(val)}
              src={EditIcon}
            />
          );
        },
      },
    },
    {
      name: "userId",
      label: "col.users.cancel",
      options: {
        customBodyRender: (val) => {
          return loading && followerId === val ? (
            <CircularProgress color="primary" size={24} />
          ) : checkIfSuspended(val) ? (
            <Tooltip placement="top" title="Enable">
              <AddCircleOutlineIcon
                className="cancelIcon green"
                onClick={() => confirmEnable(val)}
              />
            </Tooltip>
          ) : (
            <Tooltip placement="top" title="Cancel">
              <HighlightOffIcon className="cancelIcon red" onClick={() => confirmCancel(val)} />
            </Tooltip>
          );
        },
      },
    },
  ];

  /**
   * @type {Array<MUIDataTableColumn>} Table columns
   */
  const profitSharingExtraColumns = [
    {
      name: "profitsMode",
      label: "col.users.profitsmode",
      options: {
        display: "true",
        viewColumns: true,
      },
    },
    {
      name: "originalAllocated",
      label: "col.users.originallyallocated",
      options: {
        display: "true",
        viewColumns: true,
        customBodyRenderLite: (dataIndex) => {
          return (
            <span>{`${list[dataIndex].unit} ${formatFloat(
              list[dataIndex].originalAllocated,
            )}`}</span>
          );
        },
      },
    },
    {
      name: "profitsShare",
      label: "col.users.profitshare",
      options: {
        display: "true",
        viewColumns: true,
        customBodyRender: (val) => {
          return <span>{`${formatFloat2Dec(val)}%`}</span>;
        },
      },
    },
    {
      name: "retain",
      label: "col.users.retain",
      options: {
        display: "true",
        viewColumns: true,
        customBodyRenderLite: (dataIndex) => {
          return <span>{formatFloat2Dec(list[dataIndex].retain)}</span>;
        },
      },
    },
  ];

  /**
   * Exclude data table column display.
   *
   * @param {Array<MUIDataTableColumn>} columnList Table columns list.
   * @param {string} columnId ID of the column to remove.
   *
   * @returns {Void} .
   */
  function excludeDataTableColumn(columnList, columnId) {
    const columnIndex = findIndex(columnList, {
      label: columnId,
    });

    // Remove column when exists.
    if (columnIndex > -1) {
      columns[columnIndex].options = {
        viewColumns: false,
        display: "excluded",
      };
    }
  }

  if (provider.profitSharing) {
    excludedColumns.forEach((item) => {
      excludeDataTableColumn(columns, item);
    });

    columns = columns.concat(profitSharingExtraColumns);
  }

  /**
   * Function to check if user is suspended.
   *
   * @param {String} id ID of the user entity in row.
   * @returns {Boolean} Whether user is suspended or not.
   */
  const checkIfSuspended = (id) => {
    let found = list.find((item) => item.userId === id);
    if (found) {
      return !!found.suspended;
    }
    return true;
  };

  /**
   *
   * @param {String} data ID of the user.
   * @returns {void} None.
   */
  const editSubscription = (data) => {
    setFollower(data);
    showModifyModal(true);
  };

  /**
   *
   * @returns {void} None.
   */
  const toggleSubscription = () => {
    setLoading(true);
    const payload = {
      providerId: storeViews.provider.id,
      followerId: followerId,
      cancel: actionType === "cancel",
    };

    tradeApi
      .cancelSubscription(payload)
      .then(() => {
        setLoading(false);
        loadData();
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
        setLoading(false);
      });
  };

  /**
   *
   * @param {String} data ID of the user.
   * @returns {void} None.
   */
  const confirmCancel = (data) => {
    setFollower(data);
    setActionType("cancel");
    setConfirmConfig({
      titleTranslationId: "users.cancel.title",
      messageTranslationId: "users.cancel.subtitle",
      visible: true,
    });
  };

  /**
   *
   * @param {String} data ID of the user.
   * @returns {void} None.
   */
  const confirmEnable = (data) => {
    setFollower(data);
    setActionType("enable");
    setConfirmConfig({
      titleTranslationId: "users.enable.title",
      messageTranslationId: "users.enable.subtitle",
      visible: true,
    });
  };

  /**
   * @type {*}
   * @returns {void} None.
   */
  const handleModalClose = () => {
    showModifyModal(false);
  };

  const customOptions = {
    search: true,
  };

  return (
    <Box className="usersTable" display="flex" flexDirection="column" width={1}>
      <ConfirmDialog
        confirmConfig={confirmConfig}
        executeActionCallback={toggleSubscription}
        setConfirmConfig={setConfirmConfig}
      />
      <Table
        columns={columns}
        data={list}
        options={customOptions}
        persistKey={persistKey}
        title={title}
        toggleFilters={toggleFilters}
      />
      <Modal onClose={handleModalClose} persist={false} size="small" state={modifyModal}>
        <ModifyUserSubscription
          followerId={followerId}
          loadData={loadData}
          onClose={handleModalClose}
        />
      </Modal>
    </Box>
  );
};

export default UsersTable;
