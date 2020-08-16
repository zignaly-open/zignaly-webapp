import React, { useEffect, useState } from "react";
import Table from "../../../../Table";
import { Box, CircularProgress } from "@material-ui/core";
import useStoreSessionSelector from "../../../../../hooks/useStoreSessionSelector";
import tradeApi from "../../../../../services/tradeApiClient";
import { FormattedMessage } from "react-intl";
import { FormatedDateTime } from "../../../../../utils/format";
import { showErrorAlert } from "../../../../../store/actions/ui";
import { useDispatch } from "react-redux";
import "./DepositHistoryTable.scss";

/**
 * @typedef {import("mui-datatables").MUIDataTableColumn} MUIDataTableColumn
 */

/**
 * @typedef {Object} DepositHistoryTablePropTypes
 * @property {string} internalId Exchange account internal id.
 */

/**
 * Provides a table for deposits history.
 *
 * @param {DepositHistoryTablePropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const DepositHistoryTable = ({ internalId }) => {
  const storeSession = useStoreSessionSelector();
  const [deposits, setDeposits] = useState(null);
  const dispatch = useDispatch();
  const loadData = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      internalId,
    };

    tradeApi
      .exchangeLastDepositsGet(payload)
      .then((data) => {
        setDeposits(data);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };

  useEffect(loadData, [internalId, storeSession.tradeApi.accessToken]);

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
      name: "txid",
      label: "col.txnid",
    },
  ];

  const options = {
    sortOrder: { name: "timestamp", direction: "desc" },
  };

  return (
    <Box className="depositHistoryTable" display="flex" flexDirection="column" width={1}>
      {!deposits ? (
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
          data={deposits}
          // @ts-ignore
          options={options}
          persistKey="depositHistory"
          title={<FormattedMessage id="accounts.deposit.history" />}
        />
      )}
    </Box>
  );
};

export default DepositHistoryTable;
