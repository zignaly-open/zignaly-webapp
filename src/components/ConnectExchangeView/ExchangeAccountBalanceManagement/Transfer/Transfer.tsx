import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
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
import styled, { css } from "styled-components";
import dayjs from "dayjs";
import { AlignCenter, isMobile, Title } from "styles/styles";
import NumberFormat from "react-number-format";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  getStatusColor,
  getStatusTextId,
  ProviderLink,
  TransferPanel,
  TypographyAddress,
  TypographyLabel,
} from "components/WalletView/TransferPanel";
import { ArrowRightAlt } from "@material-ui/icons";
import ListIcon from "images/wallet/list.svg";
import Select from "components/WalletView/Select";

const TypographyRow = styled(Typography)`
  font-weight: 600;
  white-space: nowrap;
`;

const getPSMessage = (type: string): string => {
  switch (type) {
    case "psDeposit":
      return "transfer.internal.ps.deposit";
    case "psWithdraw":
      return "transfer.internal.ps.withdraw";
    case "psSuccessFee":
      return "transfer.internal.ps.pnl";
    default:
      return " ";
  }
};

const TypographyStatus = styled(Typography)`
  font-weight: 600;
  color: ${(props: { status: string }) => getStatusColor(props.status, props.theme)};
  white-space: nowrap;
`;

const StyledTitle = styled(Title)`
  margin-top: 12px;

  ${isMobile(css`
    flex-direction: column;
  `)}
`;

const Coin = styled.span`
  margin-left: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.newTheme.neutralText3};
`;

const getFromToName = (
  transfer: InternalTransfersHistory,
  side: "from" | "to",
  providerLink = false,
) => {
  const { toExchangeName, fromExchangeName, type, providerName, providerId } = transfer;
  if (
    (type === "psDeposit" && side === "to") ||
    ((type === "psWithdraw" || type === "psSuccessFee") && side === "from")
  ) {
    return providerLink ? (
      <ProviderLink providerId={providerId} providerName={providerName} />
    ) : (
      providerName
    );
  } else if (type === "internal") {
    return "Zignaly";
  }

  return side === "to" ? toExchangeName : fromExchangeName;
};

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
      {
        Header: intl.formatMessage({ id: "transfer.internal.form.from" }),
        accessor: "from",
      },
      {
        Header: intl.formatMessage({ id: "transfer.internal.form.to" }),
        accessor: "to",
      },
      {
        Header: intl.formatMessage({ id: "col.stat" }),
        accessor: "status",
      },
      {
        Header: "",
        id: "action",
        // accessor: "action",
        Cell: ({ row }) => (
          <AlignCenter>{row.isExpanded ? <ChevronUp /> : <ChevronDown />}</AlignCenter>
        ),
      },
    ],
    [],
  );

  const data = useMemo(
    () =>
      transfers?.map((t) => ({
        coin: (
          <AlignCenter>
            {/* <CoinIcon width={32} height={32} coin={t.asset} /> */}
            <Typography>{t.asset}</Typography>
          </AlignCenter>
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
              <FormattedMessage id={`transfer.internal.type.${t.type}`} />
            </TypographyRow>
          </AlignCenter>
        ),
        amount: (
          <AlignCenter direction="column">
            <TypographyRow>
              <NumberFormat
                value={t.amount}
                displayType="text"
                thousandSeparator={true}
                prefix={t.amount > 0 && "+"}
                decimalScale={8}
              />
              <Coin>{t.asset}</Coin>
            </TypographyRow>
          </AlignCenter>
        ),
        // txId: (
        //   <AlignCenter>
        //     <TypographyRow>{t.txId}</TypographyRow>
        //   </AlignCenter>
        // ),
        from: (
          <AlignCenter>
            <TypographyRow>{getFromToName(t, "from")}</TypographyRow>
          </AlignCenter>
        ),
        to: (
          <AlignCenter>
            <TypographyRow>{getFromToName(t, "to")}</TypographyRow>
          </AlignCenter>
        ),
        status: (
          <AlignCenter>
            <TypographyStatus status={t.status}>
              <FormattedMessage id={getStatusTextId(t.status)} />
            </TypographyStatus>
          </AlignCenter>
        ),
      })),
    [transfers],
  );

  const TransferAddressPart = ({
    transfer,
    side,
  }: {
    transfer: InternalTransfersHistory;
    side: "from" | "to";
  }) => {
    const { providerId, providerName } = transfer;

    return <TypographyAddress>{getFromToName(transfer, side, true)}</TypographyAddress>;
  };

  const renderRowSubComponent = useCallback(
    ({ row }) => {
      const transfer = transfers[row.index];

      return (
        <TransferPanel>
          <Box display="flex" alignItems="center">
            <TypographyLabel>
              <FormattedMessage id="wallet.from" />
            </TypographyLabel>
            <TransferAddressPart side="from" transfer={transfer} />
            <ArrowRightAlt style={{ margin: "0 21px" }} />
            <TypographyLabel>
              <FormattedMessage id="wallet.to" />
            </TypographyLabel>
            <TransferAddressPart side="to" transfer={transfer} />
          </Box>
          {transfer.providerId && (
            <Box display="flex" alignItems="center" mt="8px">
              <TypographyLabel>
                <FormattedMessage id="wallet.note" />
              </TypographyLabel>
              <TypographyAddress>
                <FormattedMessage
                  id={getPSMessage(transfer.type)}
                  values={{ service: transfer.providerName }}
                />
              </TypographyAddress>
            </Box>
          )}
          <Box display="flex" alignItems="center" mt="8px">
            <TypographyLabel>
              <FormattedMessage id="wallet.tx" />
            </TypographyLabel>
            <TypographyAddress>{transfer.txId}</TypographyAddress>
          </Box>
        </TransferPanel>
      );
    },
    [transfers],
  );

  // Get scroll container manually since InfiniteScroll only supports ids
  const container = document.getElementsByClassName("MuiDialog-paperScrollPaper")[0];

  return (
    <BalanceManagement>
      <Box className="exchangeAccountTransfer">
        <InternalTransferForm selectedExchange={selectedAccount} />
        <Box p="20px">
          <StyledTitle>
            <Box display="flex" alignItems="center">
              <img src={ListIcon} width={40} height={40} />
              <FormattedMessage id="transfer.internal.form.history" />
            </Box>
            {/* <FiltersBox>
            <ExportButton endIcon={<StyledExportIcon />} onClick={downloadTransactions}>
              <FormattedMessage id="wallet.export" />
            </ExportButton>
            <Select
              values={types}
              value={type}
              handleChange={(e) => setType(e.target.value as TransactionType)}
            />
          </FiltersBox> */}
          </StyledTitle>
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
                <Table
                  data={data}
                  columns={columns}
                  renderRowSubComponent={renderRowSubComponent}
                />
              </TableLayout>
            </InfiniteScroll>
          ) : (
            <Box alignItems="center" display="flex" justifyContent="center">
              <CircularProgress color="primary" size={40} />
            </Box>
          )}
        </Box>
      </Box>
    </BalanceManagement>
  );
};

export default Transfer;
