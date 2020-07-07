import React, { useEffect, useState } from "react";
import Table from "../../../../Table";
import { Box } from "@material-ui/core";
import useStoreSessionSelector from "../../../../../hooks/useStoreSessionSelector";
import tradeApi from "../../../../../services/tradeApiClient";
import "./DepositHistoryTable.scss";
import { FormattedMessage } from "react-intl";
import { FormatedDateTime } from "../../../../../utils/format";

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
  const [deposits, setDeposits] = useState([]);
  useEffect(() => {
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
          alert(`ERROR: ${e.message}`);
        });
    };
    loadData();
  }, [internalId, storeSession.tradeApi.accessToken]);

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

  return (
    <Box className="depositHistoryTable" display="flex" flexDirection="column" width={1}>
      <Table
        columns={columns}
        data={deposits}
        persistKey="depositHistory"
        title={<FormattedMessage id="accounts.deposit.history" />}
      />
    </Box>
  );
};

export default DepositHistoryTable;
