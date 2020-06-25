import React, { useEffect, useState } from "react";
import { formatFloat, formatFloat2Dec, formatTime } from "../../../../../utils/format";
import Table from "../../../../Table";
import { Box } from "@material-ui/core";
import useStoreSessionSelector from "../../../../../hooks/useStoreSessionSelector";
import tradeApi from "../../../../../services/tradeApiClient";
import "./WithdrawHistoryTable.scss";
import { FormattedMessage } from "react-intl";
import { FormatedDateTime } from "../../../../../utils/format";

const WithdrawHistoryTable = ({ internalId, updatedAt }) => {
  const storeSession = useStoreSessionSelector();
  const [withdraws, setWithdraws] = useState([]);

  useEffect(() => {
    const loadData = () => {
      const payload = {
        token: storeSession.tradeApi.accessToken,
        internalId,
      };

      tradeApi
        .exchangeLastWithdrawalsGet(payload)
        .then((data) => {
          setWithdraws(data);
        })
        .catch((e) => {
          alert(`ERROR: ${e.message}`);
        });
    };
    loadData();
  }, [internalId, storeSession.tradeApi.accessToken, updatedAt]);

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
    <Box className="withdrawHistoryTable" display="flex" flexDirection="column" width={1}>
      <Table
        columns={columns}
        data={withdraws}
        persistKey="withdrawHistory"
        title={<FormattedMessage id="accounts.withdraw.history" />}
      />
    </Box>
  );
};

export default WithdrawHistoryTable;
