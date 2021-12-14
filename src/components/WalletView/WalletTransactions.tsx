import React, { useCallback, useEffect, useMemo, useState } from "react";
import tradeApi from "services/tradeApiClient";
import { AlignCenter, Title } from "styles/styles";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import { FormattedMessage, useIntl } from "react-intl";
import ZIGIcon from "images/wallet/zignaly-coin.svg";
import ExportIcon from "images/wallet/export.inline.svg";
import Table, { TableLayout } from "./Table";
import styled from "styled-components";
import dayjs from "dayjs";
import NumberFormat from "react-number-format";
import { getChainIcon } from "utils/chain";
import { ChevronDown, ChevronUp } from "react-feather";
import { ArrowRightAlt, Share } from "@material-ui/icons";
import CoinIcon from "./CoinIcon";
import InfiniteScroll from "react-infinite-scroll-component";
import ListIcon from "images/wallet/list.svg";
import CustomButton from "components/CustomButton";
import { showErrorAlert } from "store/actions/ui";
import { useDispatch } from "react-redux";
import Select from "./Select";

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
  color: ${({ theme }) => theme.newTheme.linkText};
  font-size: 13px;
  margin-top: 10px;
  line-height: 16px;
`;

const TypographyToken = styled(Typography)`
  font-weight: 600;
  margin-left: 8px;
`;

const TypographyLabel = styled(Typography)`
  font-weight: 600;
  font-size: 13px;
`;

const TypographyAddress = styled(Typography)`
  font-size: 12px;
  margin-left: 16px;
`;

const StyledTransferPanel = styled.div`
  background-color: ${({ theme }) => theme.newTheme.backgroundAltColor};
  border: 1px dashed ${({ theme }) => (theme.palette.type === "dark" ? "#5A51F5" : "#a586e0")};
  margin: 0 16px;
  padding: 28px 20px;
  border-radius: 8px;
`;

const StyledTransferImg = styled.img`
  margin-left: 16px;
`;

const Button = styled(CustomButton)`
  min-width: 121px;
`;

const StyledTitle = styled(Title)`
  margin-top: 64px; ;
`;

const FiltersBox = styled.div`
  margin-left: auto;
`;

const ExportButton = styled(CustomButton)`
  color: ${({ theme }) => theme.newTheme.linkText};
  font-size: 12px;
  font-weight: 600;
  text-transform: none;
  min-width: auto;
`;

const StyledExportIcon = styled.svg.attrs(() => ({
  as: ExportIcon,
}))`
  color: ${({ theme }) => theme.newTheme.linkText};
`;

const getStatusColor = (status, theme) => {
  switch (status) {
    case "SUCCESS":
      return theme.newTheme.green;
    case "IN_PROGRESS":
      return theme.newTheme.yellow;
    case "FAILED":
      return theme.newTheme.red;
    default:
      return null;
  }
};

const getStatusTextId = (status) => {
  switch (status) {
    case "SUCCESS":
      return "wallet.status.completed";
    case "IN_PROGRESS":
      return "wallet.status.progress";
    case "FAILED":
      return "wallet.status.failed";
    default:
      return " ";
  }
};

interface TypographyStatusProps {
  status: string;
}
const TypographyStatus = styled(Typography)`
  font-weight: 600;
  color: ${(props: TypographyStatusProps) => getStatusColor(props.status, props.theme)};
`;

const StyledTableLayout = styled(TableLayout)`
  tr {
    height: 79px;
  }
`;

const TransferChainIcon = ({ network }: { network: string }) => {
  return <StyledTransferImg width={24} height={24} src={getChainIcon(network)} />;
};

const TransferZigLabel = ({ name }: { name?: string }) => (
  <>
    <StyledTransferImg width={24} height={24} src={ZIGIcon} style={{ marginRight: "8px" }} />
    <TypographyLabel>{name || <FormattedMessage id="wallet.zig" />}</TypographyLabel>
  </>
);

const WalletTransactions = () => {
  const [transactions, setTransactions] = useState<TransactionsHistory[]>();
  const [hasMore, setHasMore] = useState(true);
  const [type, setType] = useState<TransactionType>("all");
  const intl = useIntl();
  const dispatch = useDispatch();
  const limit = 10;

  const types = [
    {
      value: "all",
      label: intl.formatMessage({ id: "wallet.alltransactions" }),
    },
    {
      value: "deposit",
      label: intl.formatMessage({ id: "wallet.type.deposit" }),
    },
    {
      value: "internal",
      label: intl.formatMessage({ id: "wallet.type.internal" }),
    },
    {
      value: "withdraw",
      label: intl.formatMessage({ id: "wallet.type.withdraw" }),
    },
  ];

  const getTransactions = () => {
    return tradeApi.getWalletTransactionsHistory({
      type,
      limit,
      offset: transactions ? transactions.length : 0,
    });
  };

  const fetchMoreData = () => {
    getTransactions().then((response) => {
      if (response.length) {
        setTransactions(transactions.concat(response));
      } else {
        setHasMore(false);
      }
    });
  };

  useEffect(() => {
    if (transactions) {
      setTransactions(null);
    }

    getTransactions().then((response) => {
      setTransactions(response);
      if (!response.length) {
        setHasMore(false);
      }
    });
  }, [type]);

  const downloadTransactions = () => {
    tradeApi.downloadTransactions({ type }).catch((e) => {
      dispatch(showErrorAlert(e));
    });
  };

  const columns = useMemo(
    () => [
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

  const data = useMemo(
    () =>
      transactions?.map((t) => ({
        date: (
          <Box display="flex" justifyContent="center">
            <Box display="flex" flexDirection="column" alignItems="center" mr={2}>
              <TypographyRow>{dayjs(t.createdAt).format("MMM DD")}</TypographyRow>
              {t.txUrl && <TypographyTx>{t.transactionId}</TypographyTx>}
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center" ml={2}>
              <TypographyTime>{dayjs(t.createdAt).format("hh:mm A")}</TypographyTime>
              {t.txUrl && (
                <a href={t.txUrl} target="_blank" rel="noreferrer">
                  <TypographyView>
                    <FormattedMessage id="action.view" />
                  </TypographyView>
                </a>
              )}
            </Box>
          </Box>
        ),
        type: (
          <AlignCenter>
            <TypographyRow>
              <FormattedMessage id={`wallet.type.${t.type.replace("_", "").toLowerCase()}`} />
            </TypographyRow>
          </AlignCenter>
        ),
        amount: (
          <AlignCenter direction={"column"}>
            <Typography style={{ fontWeight: 600 }}>
              <NumberFormat
                value={t.formattedAmount}
                displayType="text"
                thousandSeparator={true}
                prefix={parseFloat(t.formattedAmount) > 0 && "+"}
              />
            </Typography>
          </AlignCenter>
        ),
        coin: (
          <AlignCenter>
            <CoinIcon width={24} height={24} coin={t.currency} />
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
            <TypographyStatus status={t.status}>
              <FormattedMessage id={getStatusTextId(t.status)} />
            </TypographyStatus>
          </AlignCenter>
        ),
        transactionId: t.transactionId,
        // action: (
        //   <Accordion>
        //     <AccordionSummary
        //       expandIcon={<ChevronDown />}
        //       aria-controls="panel-content"
        //     ></AccordionSummary>
        //     <AccordionDetails>

        //     </AccordionDetails>
        //   </Accordion>
        // ),
      })),
    [transactions],
  );

  const TransferAddress = ({
    transaction,
    isWithdrawal,
    side,
  }: {
    transaction: TransactionsHistory;
    isWithdrawal: boolean;
    side: "from" | "to";
  }) => {
    const { fromAddress, toAddress, fromName, toName, providerId, network, providerName } =
      transaction;
    const address = isWithdrawal ? toAddress : fromAddress;
    const name = isWithdrawal ? toName : fromName;

    const TransferAddressContent = useCallback(
      () => (
        <>
          {providerId ? (
            <>
              <TransferChainIcon network={network} />
              <TypographyAddress>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${window.location.origin}${process.env.GATSBY_BASE_PATH}/profitSharing/${providerId}`}
                >
                  {providerName}
                </a>
              </TypographyAddress>
            </>
          ) : address ? (
            <>
              <TransferChainIcon network={network} />
              <TypographyAddress>{address}</TypographyAddress>
            </>
          ) : (
            <TransferZigLabel name={name} />
          )}
        </>
      ),
      [],
    );

    if ((side === "from" && isWithdrawal) || (side === "to" && !isWithdrawal)) {
      return <TransferZigLabel />;
    }

    return <TransferAddressContent />;
  };

  const renderRowSubComponent = useCallback(
    ({ row }) => {
      const { transactionId, note } = row.values;
      const transaction = transactions.find((t) => t.transactionId === transactionId);
      const isWithdrawal = transaction.formattedAmount.startsWith("-");

      return (
        <StyledTransferPanel>
          <Box display="flex" alignItems="center">
            <TypographyLabel>
              <FormattedMessage id="wallet.from" />
            </TypographyLabel>
            <TransferAddress side="from" isWithdrawal={isWithdrawal} transaction={transaction} />
            <ArrowRightAlt style={{ margin: "0 21px" }} />
            <TypographyLabel>
              <FormattedMessage id="wallet.to" />
            </TypographyLabel>
            <TransferAddress side="to" isWithdrawal={isWithdrawal} transaction={transaction} />
          </Box>
          <Box display="flex" alignItems="center" mt="18px">
            <TypographyLabel>
              <FormattedMessage id="wallet.tx" />
            </TypographyLabel>
            <TypographyAddress>{transactionId}</TypographyAddress>
          </Box>
          {transaction.note && (
            <Box display="flex" alignItems="center" mt="8px">
              <TypographyLabel>
                <FormattedMessage id="wallet.note" />
              </TypographyLabel>
              <TypographyAddress>{transaction.note}</TypographyAddress>
            </Box>
          )}
        </StyledTransferPanel>
      );
    },
    [transactions],
  );

  const tableState = {
    hiddenColumns: ["transactionId"],
  };

  return !transactions ? (
    <Box alignItems="center" display="flex" justifyContent="center" mt={4}>
      <CircularProgress color="primary" size={40} />
    </Box>
  ) : (
    <>
      <StyledTitle>
        <img src={ListIcon} width={40} height={40} />
        <FormattedMessage id="wallet.transactions" />
        <FiltersBox>
          <ExportButton endIcon={<StyledExportIcon />} onClick={downloadTransactions}>
            <FormattedMessage id="wallet.export" />
          </ExportButton>
          <Select values={types} value={type} handleChange={(e) => setType(e.target.value)} />
        </FiltersBox>
      </StyledTitle>
      <InfiniteScroll
        dataLength={transactions.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        }
      >
        <StyledTableLayout>
          <Table
            data={data}
            columns={columns}
            renderRowSubComponent={renderRowSubComponent}
            initialState={tableState}
          />
        </StyledTableLayout>
      </InfiniteScroll>
    </>
  );
};

export default WalletTransactions;
