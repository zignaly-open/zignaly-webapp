import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@material-ui/core";
import { useDispatch } from "react-redux";
import Table from "../../../../Table";
import tradeApi from "../../../../../services/tradeApiClient";
import { FormattedMessage } from "react-intl";
import { FormatedDateTime } from "../../../../../utils/format";
import { showErrorAlert } from "../../../../../store/actions/ui";
import "./WithdrawHistoryTable.scss";

/**
 * @typedef {import("mui-datatables").MUIDataTableColumn} MUIDataTableColumn
 * @typedef {import("mui-datatables").MUIDataTableOptions} MUIDataTableOptions
 */

/**
 * @typedef {Object} WithdrawHistoryTablePropTypes
 * @property {string} internalId Exchange account internal id.
 * @property {Date} updatedAt Last updated date to force data refresh.
 */

/**
 * Provides a table for withdraw history.
 *
 * @param {WithdrawHistoryTablePropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const WithdrawHistoryTable = ({ internalId, updatedAt }) => {
  const [withdraws, setWithdraws] = useState(null);
  const dispatch = useDispatch();
  const loadData = () => {
    const payload = {
      internalId,
    };

    tradeApi
      .exchangeLastWithdrawalsGet(payload)
      .then((data) => {
        setWithdraws(data);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };

  useEffect(loadData, [internalId, updatedAt]);

  /**
   * @type {Array<MUIDataTableColumn>} Table columns
   */
  let columns = [
    {
      name: "status",
      label: "col.stat",
    },
    {
      name: "currency",
      label: "col.coin",
    },
    {
      name: "amount",
      label: "col.amount",
    },
    {
      name: "timestamp",
      label: "col.date",
      options: {
        customBodyRender: FormatedDateTime,
      },
    },
    {
      name: "tag",
      label: "col.information",
    },
    {
      name: "txid",
      label: "col.txnid",
    },
  ];

  /**
   * @type {MUIDataTableOptions}
   */
  const options = {
    sortOrder: {
      name: "timestamp",
      direction: "desc",
    },
  };

  return (
    <Box className="withdrawHistoryTable" display="flex" flexDirection="column" width={1}>
      {!withdraws ? (
        <Box
          alignItems="center"
          className="loadingBox"
          display="flex"
          flexDirection="row"
          justifyContent="center"
        >
          <CircularProgress color="primary" size={40} />
        </Box>
      ) : (
        <Table
          columns={columns}
          data={withdraws}
          options={options}
          persistKey="withdrawHistory"
          title={<FormattedMessage id="accounts.withdraw.history" />}
        />
      )}
    </Box>
  );
};

export default WithdrawHistoryTable;
