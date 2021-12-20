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
import InfiniteScroll from "react-infinite-scroll-component";

const TypographyRow = styled(Typography)`
  font-weight: 600;
`;

const Transfer = () => {
  const {
    pathParams: { selectedAccount },
  } = useContext(ModalPathContext);
  const intl = useIntl();
  const dispatch = useDispatch();
  const [transfers, setTransfers] = useState<InternalTransfersHistory[]>(null);
  const [hasMore, setHasMore] = useState(true);
  const [type, setType] = useState<TransactionType>("all");
  const limit = 20;

  const getInternalTransfersHistory = (_transactions: InternalTransfersHistory[]) => {
    return tradeApi
      .getInternalTransfersHistory({
        exchangeInternalId: selectedAccount.internalId,
        limit,
        type,
        offset: _transactions ? _transactions.length : 0,
      })
      .then((response) => {
        setHasMore(response.length === limit);
        return response;
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
        throw e;
      });
  };

  const fetchMoreData = () => {
    getInternalTransfersHistory(transfers).then((response) => {
      setTransfers(transfers.concat(response));
    });
  };

  useEffect(() => {
    setTransfers(null);

    getInternalTransfersHistory(null).then((response) => {
      setTransfers(response);
    });
  }, [type]);

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
      transfers?.map((t) => ({
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
    [transfers],
  );

  // Get scroll container manually since InfiniteScroll only supports ids
  const container = document.getElementsByClassName("MuiDialog-paperScrollPaper")[0];

  return (
    <BalanceManagement>
      <Box className="exchangeAccountTransfer">
        <InternalTransferForm selectedExchange={selectedAccount} />
        {transfers ? (
          <InfiniteScroll
            style={{ overflow: "visible" }}
            scrollableTarget={container}
            dataLength={transfers.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={
              <Box display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
            }
          >
            <TableLayout>
              <Table data={data} columns={columns} />
            </TableLayout>
          </InfiniteScroll>
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
