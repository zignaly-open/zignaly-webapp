import React, { useEffect, useState } from "react";
import tradeApi from "services/tradeApiClient";
import { Panel, SubTitle, Title, AlignCenter } from "styles/styles";
import { Box, CircularProgress, Grid, Typography } from "@material-ui/core";
import { FormattedMessage, useIntl } from "react-intl";
import ZIGIcon from "images/wallet/zignaly-coin.svg";
// import ZIGIcon from "images/wallet/zig.svg";
import Table, { TableLayout } from "./Table";
import styled from "styled-components";
import dayjs from "dayjs";
import { formatDate } from "utils/format";
import NumberFormat from "react-number-format";
import { getChainIcon } from "utils/chain";

const Date = styled.a`
  font-size: 14px;
  display: flex;
  align-items: center;
`;

const TypographyRow = styled(Typography)`
  font-weight: 600;
`;

const TypographyTime = styled(Typography)`
  font-weight: 600;
  color: ${({ theme }) => theme.newTheme.secondaryText};
`;

const TypographyTx = styled(Typography)`
  font-size: 12px;
  color: ${({ theme }) => theme.newTheme.secondaryText};
  margin-top: 10px;
  line-height: 16px;
  width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 58px;
`;

const TypographyView = styled(Typography)`
  color: ${({ theme }) => theme.transactionTable.linkText};
  font-size: 13px;
  margin-top: 10px;
  line-height: 16px;
`;

const TypographyToken = styled(Typography)`
  font-weight: 600;
  margin-left: 8px;
`;

const TypographyStatus = styled(Typography)`
  font-weight: 600;
  color: #26c4c1;
`;

const WalletTransactions = () => {
  const [transactions, setTransactions] = useState<TransactionsHistory[]>();
  const intl = useIntl();

  const columns = [
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
    {
      Header: intl.formatMessage({ id: "col.token" }),
      accessor: "coin",
    },
    {
      Header: intl.formatMessage({ id: "col.network" }),
      accessor: "network",
    },
    {
      Header: intl.formatMessage({ id: "col.stat" }),
      accessor: "status",
    },
  ];

  const data =
    transactions &&
    transactions.map((t) => ({
      date: (
        <Box display="flex" justifyContent="center">
          <Box display="flex" flexDirection="column" alignItems="center" mr={2}>
            <TypographyRow>{dayjs(t.createdAt).format("MMM DD")}</TypographyRow>
            <TypographyTx>{t.transactionId}</TypographyTx>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center" ml={2}>
            <TypographyTime>{dayjs(t.createdAt).format("hh:mm A")}</TypographyTime>
            <a href={t.txUrl} target="_blank" rel="noreferrer">
              <TypographyView>
                <FormattedMessage id="action.view" />
              </TypographyView>
            </a>
          </Box>
        </Box>
      ),
      type: (
        <AlignCenter>
          <TypographyRow>
            <FormattedMessage id={`wallet.type.${t.type.toLowerCase()}`} />
          </TypographyRow>
        </AlignCenter>
      ),
      amount: (
        <AlignCenter direction={"column"}>
          <Typography style={{ fontWeight: 600 }}>
            <NumberFormat
              value={t.amount}
              displayType="text"
              thousandSeparator={true}
              prefix={parseFloat(t.amount) > 0 && "+"}
            />
          </Typography>
        </AlignCenter>
      ),
      coin: (
        <AlignCenter>
          <img width={24} height={24} src={ZIGIcon} />
          <TypographyToken>{t.currency}</TypographyToken>
        </AlignCenter>
      ),
      network: (
        <AlignCenter>
          <img width={24} height={24} src={getChainIcon(t.network)} />
          <TypographyToken>{t.network}</TypographyToken>
        </AlignCenter>
      ),
      status: (
        <AlignCenter>
          <TypographyStatus>
            <FormattedMessage id="wallet.status.completed" />
          </TypographyStatus>
        </AlignCenter>
      ),
    }));

  useEffect(() => {
    tradeApi.getWalletTransactionsHistory().then((response) => {
      setTransactions(response);
      // console.log(response);
    });
  }, []);

  if (!transactions) {
    return (
      <Box alignItems="center" display="flex" justifyContent="center">
        <CircularProgress color="primary" size={40} />
      </Box>
    );
  }

  return (
    <TableLayout>
      <Table data={data} columns={columns} />
    </TableLayout>
  );
};

export default WalletTransactions;
