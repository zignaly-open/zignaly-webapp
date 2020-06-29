import React, { useState } from "react";
import "./UsersTable.scss";
import { Box } from "@material-ui/core";
import Table from "../../../Table";
import { FormattedMessage } from "react-intl";
import EditIcon from "../../../../images/ct/edit.svg";
import CancelIcon from "@material-ui/icons/Cancel";
import Modal from "../../../Modal";
import ModifyUserSubscription from "../../../Forms/ModifyUserSubscription";
import { formatDate } from "../../../../utils/format";

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
  console.log(list);
  const [modifyModal, showModifyModal] = useState(false);
  const [followerId, setFollower] = useState("");
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
          return <span className={val ? "green" : "red"}> {val ? "TRUE" : "FALSE"}</span>;
        },
      },
    },
    {
      name: "active",
      label: "col.users.active",
      options: {
        customBodyRender: (val) => {
          return <span className={val ? "green" : "red"}> {val ? "TRUE" : "FALSE"}</span>;
        },
      },
    },
    {
      name: "suspended",
      label: "col.users.suspended",
      options: {
        customBodyRender: (val) => {
          return <span className={val ? "greed" : "red"}> {val ? "TRUE" : "FALSE"}</span>;
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
          return val === "-" ? val : <span>{formatDate(val, "YYYY/MM/DD")}</span>;
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
              src={EditIcon}
              onClick={() => editSubscription(val)}
              alt="zignaly"
              className="editIcon"
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
          return (
            <CancelIcon
              color="primary"
              onClick={() => cancelSubscription(val)}
              className="cancelIcon"
            />
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
   * @param {String} data ID of the user.
   * @returns {void} None.
   */
  const cancelSubscription = (data) => {
    console.log(data);
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
      <Table columns={columns} data={list} persistKey={persistKey} title={title} />
      <Modal persist={false} size="sm" onClose={handleModalClose} state={modifyModal}>
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
