import React, { useState } from "react";
import "./UsersTable.scss";
import { Box, CircularProgress } from "@material-ui/core";
import Table from "../../../Table";
import { FormattedMessage } from "react-intl";
import EditIcon from "../../../../images/ct/edit.svg";
import CancelIcon from "@material-ui/icons/Cancel";
import Modal from "../../../Modal";
import ModifyUserSubscription from "../../../Forms/ModifyUserSubscription";
import { formatDate } from "../../../../utils/format";
import { ConfirmDialog } from "../../../Dialogs";
import useStoreViewsSelector from "../../../../hooks/useStoreViewsSelector";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import tradeApi from "../../../../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../../../../store/actions/ui";

/** ]
 * @typedef {import("mui-datatables").MUIDataTableColumn} MUIDataTableColumn
 * @typedef {import("mui-datatables").MUIDataTableMeta} MUIDataTableMeta
 * @typedef {import("../../../../store/initialState").UserEquityEntity} UserEquityEntity
 */

/**
 * Provides a table to display providers' profits stats.
 *
 * @typedef {Object} DefaultProps
 * @property {string | React.ReactNode} title Table title.
 * @property {string} persistKey Key to save display columns settings.
 * @property {Array<UserEquityEntity>} list
 * @property {Function} loadData
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} Component JSX.
 */
const UsersTable = ({ title, persistKey, list, loadData }) => {
  const storeViews = useStoreViewsSelector();
  const storeSession = useStoreSessionSelector();
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
  const [confirmConfig, setConfirmConfig] = useState(initConfirmConfig);
  const dispatch = useDispatch();

  /**
   * @type {Array<MUIDataTableColumn>} Table columns
   */

  let columns = [
    { name: "userId", label: "col.users.userid" },
    { name: "email", label: "col.users.email" },
    { name: "name", label: "col.users.name" },
    {
      name: "connected",
      label: "col.users.connected",
      options: {
        display: "true",
        viewColumns: true,
        customBodyRender: (val) => {
          return <span> {val ? "Yes" : "No"}</span>;
        },
      },
    },
    {
      name: "active",
      label: "col.users.active",
      options: {
        customBodyRender: (val) => {
          return <span> {val ? "Yes" : "No"}</span>;
        },
      },
    },
    {
      name: "suspended",
      label: "col.users.suspended",
      options: {
        customBodyRender: (val) => {
          return <span> {val ? "Yes" : "No"}</span>;
        },
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
    { name: "allocatedBalance", label: "col.users.allocatedbalance" },
    { name: "profitsFromClosedBalance", label: "col.users.profits" },
    { name: "code", label: "col.users.code" },
    { name: "lastTransactionId", label: "col.users.lasttransaction" },
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
          ) : (
            <CancelIcon className="cancelIcon" color="primary" onClick={() => confirm(val)} />
          );
        },
      },
    },
  ];

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
  const cancelSubscription = () => {
    setLoading(true);
    const payload = {
      token: storeSession.tradeApi.accessToken,
      providerId: storeViews.provider.id,
      followerId: followerId,
      cancel: true,
    };

    tradeApi
      .cancelSubscription(payload)
      .then((response) => {
        if (response) {
          setLoading(false);
          loadData();
        }
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
  const confirm = (data) => {
    setFollower(data);
    setConfirmConfig({ ...initConfirmConfig, visible: true });
  };

  /**
   * @type {*}
   * @returns {void} None.
   */
  const handleModalClose = () => {
    showModifyModal(false);
  };

  return (
    <Box className="usersTable" display="flex" flexDirection="column" width={1}>
      <ConfirmDialog
        confirmConfig={confirmConfig}
        executeActionCallback={cancelSubscription}
        setConfirmConfig={setConfirmConfig}
      />
      <Table columns={columns} data={list} persistKey={persistKey} title={title} />
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
