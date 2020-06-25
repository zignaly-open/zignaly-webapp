import React, { useEffect, useState } from "react";
import { formatFloat, formatFloat2Dec, formatTime } from "../../../../../utils/format";
import Table from "../../../../Table";
import { Box } from "@material-ui/core";
import useStoreSessionSelector from "../../../../../hooks/useStoreSessionSelector";
import tradeApi from "../../../../../services/tradeApiClient";
import "./DepositHistoryTable.scss";
import { FormattedMessage, FormattedDate, FormattedTime } from "react-intl";
import { FormatedDateTime } from "../../../../../utils/format";

const DepositHistoryTable = ({ internalId }) => {
  const storeSession = useStoreSessionSelector();
  const [deposits, setDeposits] = useState([]);
  const intl = useEffect(() => {
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
