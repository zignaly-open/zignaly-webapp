import React, { useContext, useEffect, useMemo, useState } from "react";
import ModalPathContext from "../../ModalPathContext";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import "./Transfer.scss";
import BalanceManagement from "../BalanceManagement";
import InternalTransferForm from "components/Forms/InternalTransferForm";
import Table, { TableLayout } from "components/WalletView/Table";
import { FormattedMessage, useIntl } from "react-intl";
import tradeApi from "services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "store/actions/ui";
import { ChevronDown, ChevronUp } from "react-feather";
import CoinIcon from "components/WalletView/CoinIcon";
import styled from "styled-components";
import dayjs from "dayjs";
import { AlignCenter } from "styles/styles";
import NumberFormat from "react-number-format";

const TypographyRow = styled(Typography)`
  font-weight: 600;
`;

const Transfer = () => {
  const {
    pathParams: { selectedAccount },
  } = useContext(ModalPathContext);
  const intl = useIntl();
  const dispatch = useDispatch();
  const [transactions, setTransactions] = useState<InternalTransfersHistory[]>(null);

  useEffect(() => {
    tradeApi
      .getInternalTransfersHistory({ exchangeInternalId: selectedAccount.internalId })
      .then(setTransactions)
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: intl.formatMessage({ id: "col.token" }),
        accessor: "coin",
      },
      {
        Header: intl.formatMessage({ id: "col.date" }),
        accessor: "date",
      },
      {
        Header: intl.formatMessage({ id: "accounts.exchange.type" }),
        accessor: "type",
      },
      {
        Header: intl.formatMessage({ id: "col.amount" }),
        accessor: "amount",
      },
      // {
      //   Header: intl.formatMessage({ id: "transfer.internal.transactionId" }),
      //   accessor: "txId",
      // },
      // {
      //   Header: intl.formatMessage({ id: "transfer.internal.form.from" }),
      //   accessor: "from",
      // },
      // {
      //   Header: intl.formatMessage({ id: "transfer.internal.form.to" }),
      //   accessor: "to",
      // },
      {
        Header: intl.formatMessage({ id: "col.stat" }),
        accessor: "status",
      },
      {
        Header: "",
        id: "action",
        // accessor: "action",
        Cell: ({ row }) => (row.isExpanded ? <ChevronUp /> : <ChevronDown />),
      },
      { Header: "", accessor: "transactionId" },
    ],
    [],
  );

  const getType = (type: string) => {
    switch (type) {
      case "in":
        return "wallet.type.deposit";
      case "out":
        return "wallet.type.withdraw";
      default:
        return " ";
    }
  };

  const data = useMemo(
    () =>
      transactions?.map((t) => ({
        coin: (
          <Box display="flex">
            <CoinIcon width={32} height={32} coin={t.asset} />
            <Typography>{t.asset}</Typography>
          </Box>
        ),
        date: (
          <AlignCenter direction="column">
            <TypographyRow>{dayjs(t.requestedAt).format("hh:mm A")}</TypographyRow>
            <TypographyRow>{dayjs(t.requestedAt).format("MMM DD, YYYY")}</TypographyRow>
          </AlignCenter>
        ),
        type: (
          <AlignCenter>
            <TypographyRow>
              <FormattedMessage id={getType(t.transferType)} />
            </TypographyRow>
          </AlignCenter>
        ),
        amount: (
          <AlignCenter direction={"column"}>
            <TypographyRow>
              <NumberFormat
                value={t.amount}
                displayType="text"
                thousandSeparator={true}
                prefix={t.amount > 0 && "+"}
                suffix={t.asset}
              />
            </TypographyRow>
          </AlignCenter>
        ),
        // txId: (
        //   <AlignCenter>
        //     <TypographyRow>{t.txId}</TypographyRow>
        //   </AlignCenter>
        // ),
        // from: (
        //   <AlignCenter>
        //     <TypographyRow>{t.from}</TypographyRow>
        //   </AlignCenter>
        // ),
        // to: (
        //   <AlignCenter>
        //     <TypographyRow>{t.to}</TypographyRow>
        //   </AlignCenter>
        // ),
        status: (
          <AlignCenter>
            {/* <TypographyStatus status={t.status}>
              <FormattedMessage id={getStatusTextId(t.status)} />
            </TypographyStatus> */}
          </AlignCenter>
        ),
        // transactionId: t.transactionId,
      })),
    [transactions],
  );

  return (
    <BalanceManagement>
      <Box className="exchangeAccountTransfer">
        <InternalTransferForm selectedExchange={selectedAccount} />
        {transactions ? (
          <TableLayout>
            <Table data={data} columns={columns} />
          </TableLayout>
        ) : (
          <Box alignItems="center" display="flex" justifyContent="center">
            <CircularProgress color="primary" size={40} />
          </Box>
        )}
      </Box>
    </BalanceManagement>
  );
};

export default Transfer;
