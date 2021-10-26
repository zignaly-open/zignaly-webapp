import React, { useEffect, useState } from "react";
import tradeApi from "services/tradeApiClient";
import { Panel, SubTitle, Title, AlignCenter } from "styles/styles";
import { Box, CircularProgress, Grid, Typography } from "@material-ui/core";
import { FormattedMessage, useIntl } from "react-intl";
import ZIGIcon from "images/wallet/zignaly-coin.svg";
import ETHIcon from "images/wallet/eth.svg";
import BSCIcon from "images/wallet/bsc.svg";
// import ZIGIcon from "images/wallet/zig.svg";
import Table, { TableLayout } from "./Table";
import styled from "styled-components";
import dayjs from "dayjs";
import { formatDate } from "utils/format";
import NumberFormat from "react-number-format";

const getChainIcon = (chain: string) => {
  switch (chain) {
    case "BSC":
      return BSCIcon;
    default:
      return ETHIcon;
  }
};

const Date = styled.a`
  font-size: 14px;
  display: flex;
  align-items: center;
`;

const TypographyDate = styled(Typography)`
  font-weight: 600;
`;

const TypographyTime = styled(Typography)`
  font-weight: 600;
  color: #9ca3af;
`;

const TypographyTx = styled(Typography)`
  font-size: 12px;
  color: #9ca3af;
  margin-top: 10px;
  line-height: 16px;
`;

const TypographyView = styled(Typography)`
  color: #829fff;
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
    // {
    //   Header: intl.formatMessage({ id: "accounts.exchange.type" }),
    //   accessor: "type",
    // },
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
  console.log(transactions);
  const data =
    transactions &&
    transactions.map((t) => ({
      date: (
        <Box display="flex" justifyContent="center">
          <Box display="flex" flexDirection="column" alignItems="center" mr={2}>
            <TypographyDate>{dayjs(t.createdAt).format("MMM DD")}</TypographyDate>
            <TypographyTx>0xtodo...</TypographyTx>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center" ml={2}>
            <TypographyTime>{dayjs(t.createdAt).format("hh:mm A")}</TypographyTime>
            <a href="todo" target="_blank">
              <TypographyView>
                <FormattedMessage id="action.view" />
              </TypographyView>
            </a>
          </Box>
        </Box>
        // <AlignCenter>
        //   <Date href={t.txUrl} target={"_blank"}>
        //     {/* <ExternalLink src={ExternalLinkImage} width={"10px"} height={"10px"} /> */}
        //   </Date>
        // </AlignCenter>
      ),
      // status: (
      //   <AlignCenter>
      //     <StateLabel
      //       type={transfer.state}
      //       fromChain={transfer.fromChain}
      //       toChain={transfer.toChain}
      //     />
      //     <div style={{ width: "22px" }} />
      //     <ToolTip
      //       position={"bottom"}
      //       content={renderStatusContent(transfer.state, transfer)}
      //       target={
      //         <InfoMark>
      //           <AlertOutline
      //             width={"14px"}
      //             height={"20px"}
      //             style={{
      //               position: "relative",
      //               left: "2px",
      //               top: "-1px",
      //             }}
      //           />
      //         </InfoMark>
      //       }
      //     />
      //   </AlignCenter>
      // ),
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
      // fromChain: (
      //   <AlignCenter>
      //     <Chains>
      //       <Chain>
      //         <ChainImage src={transfer.fromChain.image} />
      //         <ChainName color={transfer.fromChain.color}>{transfer.fromChain.shortName}</ChainName>
      //       </Chain>
      //     </Chains>
      //   </AlignCenter>
      // ),
      // separator: (
      //   <AlignCenter>
      //     <Separator>
      //       <ArrowForward src={ArrowWideShort} width={"18px"} height={"18px"} />
      //     </Separator>
      //   </AlignCenter>
      // ),
      coin: (
        <AlignCenter>
          <img width={24} height={24} src={ZIGIcon} />
          <TypographyToken>{t.currency}</TypographyToken>
        </AlignCenter>
      ),
      network: (
        <AlignCenter>
          <img width={24} height={24} src={getChainIcon("ETH")} />
          <TypographyToken>TODO</TypographyToken>
        </AlignCenter>
      ),
      status: (
        <AlignCenter>
          <TypographyStatus>
            <FormattedMessage id="wallet.status.completed" />
          </TypographyStatus>
        </AlignCenter>
      ),
      // action: (
      //   <AlignCenter>
      //     <TransferActionButton transfer={transfer} />
      //     {transfer.state === transferStateId.PROCESSING && (
      //       <Link
      //         href={`${transfer.fromChain.scanLink}/tx/${transfer.transactionHash}`}
      //         target={"_blank"}
      //       >
      //         View transaction
      //         <ExternalLink src={ExternalLinkImage} width={"10px"} height={"10px"} />
      //       </Link>
      //     )}
      //   </AlignCenter>
      // ),
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
