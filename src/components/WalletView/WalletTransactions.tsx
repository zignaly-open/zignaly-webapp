import React, { useCallback, useEffect, useMemo, useState } from "react";
import tradeApi from "services/tradeApiClient";
import { AlignCenter, isMobile, Title } from "styles/styles";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import { FormattedMessage, useIntl } from "react-intl";
import ZIGIcon from "images/wallet/zignaly-coin.svg";
import ExportIcon from "images/wallet/export.inline.svg";
import Table, { TableLayout } from "./Table";
import styled, { css } from "styled-components";
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
import {
  getStatusColor,
  getStatusTextId,
  ProviderLink,
  TransferPanel,
  TypographyAddress,
  TypographyLabel,
} from "./TransferPanel";

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

const StyledTransferImg = styled.img`
  margin-left: 16px;
`;

const Button = styled(CustomButton)`
  min-width: 121px;
`;

const StyledTitle = styled(Title)`
  margin-top: 56px;

  ${isMobile(css`
    flex-direction: column;
  `)}
`;

const FiltersBox = styled.div`
  text-transform: none;
  margin-left: auto;
  display: flex;
  align-items: center;

  ${isMobile(css`
    margin: 32px 0 0;
  `)}
`;

const ExportButton = styled(CustomButton)`
  color: ${({ theme }) => theme.newTheme.linkText};
  font-size: 12px;
  font-weight: 600;
  text-transform: none;
  min-width: auto;
  width: auto;
  margin-right: 18px;
`;

const StyledExportIcon = styled.svg.attrs(() => ({
  as: ExportIcon,
}))`
  color: ${({ theme }) => theme.newTheme.linkText};
`;

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

const WalletTransactions = ({ updateAt }: { updateAt: Date }) => {
  const [transactions, setTransactions] = useState<TransactionsHistory[]>();
  const [hasMore, setHasMore] = useState(true);
  const [type, setType] = useState<TransactionType>("all");
  const intl = useIntl();
  const dispatch = useDispatch();
  const limit = 20;

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
      value: "withdraw",
      label: intl.formatMessage({ id: "wallet.type.withdraw" }),
    },
    {
      value: "cashback_volume",
      label: intl.formatMessage({ id: "wallet.type.cashbackvolume" }),
    },
    {
      value: "coin_salvage",
      label: intl.formatMessage({ id: "wallet.type.coinsalvage" }),
    },
    {
      value: "compensation",
      label: intl.formatMessage({ id: "wallet.type.compensation" }),
    },
    {
      value: "payment",
      label: intl.formatMessage({ id: "wallet.type.payment" }),
    },
    {
      value: "reward",
      label: intl.formatMessage({ id: "wallet.type.reward" }),
    },
    {
      value: "success_fee",
      label: intl.formatMessage({ id: "wallet.type.successfee" }),
    },
    {
      value: "withdraw_fee",
      label: intl.formatMessage({ id: "wallet.type.withdrawfee" }),
    },
    {
      value: "zigpad_pledge",
      label: intl.formatMessage({ id: "wallet.type.zigpadpledge" }),
    },
    {
      value: "zigpad_return",
      label: intl.formatMessage({ id: "wallet.type.zigpadreturn" }),
    },
    {
      value: "zigpad_reward",
      label: intl.formatMessage({ id: "wallet.type.zigpadtokensreward" }),
    },
    {
      value: "buy_zig",
      label: intl.formatMessage({ id: "wallet.type.buyzig" }),
    },
  ];

  const getTransactions = (_transactions: TransactionsHistory[]) => {
    return tradeApi
      .getWalletTransactionsHistory({
        type,
        limit,
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
    getTransactions(transactions).then((response) => {
      setTransactions(transactions.concat(response));
    });
  };

  useEffect(() => {
    setTransactions(null);

    getTransactions(null).then((response) => {
      setTransactions(response);
    });
  }, [type, updateAt]);

  const downloadTransactions = () => {
    tradeApi.downloadTransactions().catch((e) => {
      dispatch(showErrorAlert(e));
    });
  };

  const columns = useMemo(
    () => [
      {
        Header: intl.formatMessage({ id: "col.date" }).toLowerCase(),
        accessor: "date",
      },
      {
        Header: intl.formatMessage({ id: "accounts.exchange.type" }),
        accessor: "type",
      },
      {
        Header: intl.formatMessage({ id: "col.amount" }).toLowerCase(),
        accessor: "amount",
      },
      {
        Header: intl.formatMessage({ id: "col.token" }).toLowerCase(),
        accessor: "coin",
      },
      {
        Header: intl.formatMessage({ id: "col.network" }).toLowerCase(),
        accessor: "network",
      },
      {
        Header: intl.formatMessage({ id: "col.stat" }).toLowerCase(),
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
              <FormattedMessage id={`wallet.type.${t.type.replace(/_/g, "").toLowerCase()}`} />
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

  const TransferAddressPart = ({
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

    const TransferAddressContent = useCallback(() => {
      return transaction.zigpadId ? (
        <>
          <StyledTransferImg
            src={transaction.zigpadLogo}
            width={24}
            height={24}
            style={{ marginRight: "8px" }}
          />
          <TypographyLabel>{transaction.zigpadName}</TypographyLabel>
        </>
      ) : providerId || address ? (
        <>
          <TransferChainIcon network={network} />
          <TypographyAddress>
            {providerId ? (
              <ProviderLink providerId={providerId} providerName={providerName} />
            ) : (
              address
            )}
          </TypographyAddress>
        </>
      ) : (
        <TransferZigLabel name={name} />
      );
    }, []);

    if ((side === "from" && isWithdrawal) || (side === "to" && !isWithdrawal)) {
      // Zig Wallet
      return <TransferZigLabel />;
    }

    return <TransferAddressContent />;
  };

  const renderRowSubComponent = useCallback(
    ({ row }) => {
      const { transactionId, note } = row.values;
      const transaction = transactions[row.index];
      const isWithdrawal = transaction.formattedAmount.startsWith("-");

      return (
        <TransferPanel>
          <Box display="flex" alignItems="center">
            <TypographyLabel>
              <FormattedMessage id="wallet.from" />
            </TypographyLabel>
            <TransferAddressPart
              side="from"
              isWithdrawal={isWithdrawal}
              transaction={transaction}
            />
            <ArrowRightAlt style={{ margin: "0 21px" }} />
            <TypographyLabel>
              <FormattedMessage id="wallet.to" />
            </TypographyLabel>
            <TransferAddressPart side="to" isWithdrawal={isWithdrawal} transaction={transaction} />
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
        </TransferPanel>
      );
    },
    [transactions],
  );

  const tableState = {
    hiddenColumns: ["transactionId"],
  };

  // Get scroll container manually since InfiniteScroll only supports ids
  const container = document.getElementsByClassName("MuiDialog-paperScrollPaper")[0];

  return (
    <>
      <StyledTitle>
        <Box display="flex" alignItems="center">
          <img src={ListIcon} width={40} height={40} />
          <FormattedMessage id="wallet.transactions" />
        </Box>
        <FiltersBox>
          <ExportButton endIcon={<StyledExportIcon />} onClick={downloadTransactions}>
            <FormattedMessage id="wallet.export" />
          </ExportButton>
          <Select
            values={types}
            value={type}
            handleChange={(e) => setType(e.target.value as TransactionType)}
            variant="rainbow"
          />
        </FiltersBox>
      </StyledTitle>
      {!transactions ? (
        <Box alignItems="center" display="flex" justifyContent="center" mt={4}>
          <CircularProgress color="primary" size={40} />
        </Box>
      ) : (
        <InfiniteScroll
          style={{ overflow: "visible" }}
          scrollableTarget={container}
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
      )}
    </>
  );
};

export default WalletTransactions;
