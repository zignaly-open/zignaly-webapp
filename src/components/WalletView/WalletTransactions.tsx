import React, { useEffect, useState } from "react";
import tradeApi from "services/tradeApiClient";
import { Panel, SubTitle, Title } from "styles/styles";
import { Box } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import ListIcon from "images/wallet/list.svg";
import Table from "./Table";

const WalletTransactions = () => {
  const [transactions, setTransactions] = useState();

  return <div></div>;
  const columns = [
    {
      Header: "Status",
      accessor: "state",
    },
    {
      Header: "Amount / Date",
      accessor: "amount",
    },
    {
      Header: "From",
      accessor: "fromChain",
    },
    {
      Header: "",
      accessor: "separator",
    },
    {
      Header: "To",
      accessor: "toChain",
    },
    {
      header: "",
      accessor: "action",
    },
  ];
  const data =
    transactions &&
    transactions.map((transfer) => ({
      state: (
        <AlignCenter>
          <StateLabel
            type={transfer.state}
            fromChain={transfer.fromChain}
            toChain={transfer.toChain}
          />
          <div style={{ width: "22px" }} />
          <ToolTip
            position={"bottom"}
            content={renderStatusContent(transfer.state, transfer)}
            target={
              <InfoMark>
                <AlertOutline
                  width={"14px"}
                  height={"20px"}
                  style={{
                    position: "relative",
                    left: "2px",
                    top: "-1px",
                  }}
                />
              </InfoMark>
            }
          />
        </AlignCenter>
      ),
      amount: (
        <AlignCenter direction={"column"}>
          <Value>
            <NumberFormat
              value={transfer.amount}
              displayType={"text"}
              suffix={" ZIG"}
              thousandSeparator={true}
            />
          </Value>
          <Date
            href={`${transfer.fromChain.scanLink}/tx/${transfer.transactionHash}`}
            target={"_blank"}
          >
            {format(getCurrentTimezone(transfer.createdAt), "HH:mm MMM dd")}
            <ExternalLink src={ExternalLinkImage} width={"10px"} height={"10px"} />
          </Date>
        </AlignCenter>
      ),
      fromChain: (
        <AlignCenter>
          <Chains>
            <Chain>
              <ChainImage src={transfer.fromChain.image} />
              <ChainName color={transfer.fromChain.color}>{transfer.fromChain.shortName}</ChainName>
            </Chain>
          </Chains>
        </AlignCenter>
      ),
      separator: (
        <AlignCenter>
          <Separator>
            <ArrowForward src={ArrowWideShort} width={"18px"} height={"18px"} />
          </Separator>
        </AlignCenter>
      ),
      toChain: (
        <AlignCenter>
          <Chains>
            <Chain>
              <ChainImage src={transfer.toChain.image} />
              <ChainName color={transfer.toChain.color}>{transfer.toChain.shortName}</ChainName>
            </Chain>
          </Chains>
        </AlignCenter>
      ),
      action: (
        <AlignCenter>
          <TransferActionButton transfer={transfer} />
          {transfer.state === transferStateId.PROCESSING && (
            <Link
              href={`${transfer.fromChain.scanLink}/tx/${transfer.transactionHash}`}
              target={"_blank"}
            >
              View transaction
              <ExternalLink src={ExternalLinkImage} width={"10px"} height={"10px"} />
            </Link>
          )}
        </AlignCenter>
      ),
    }));

  useEffect(() => {
    tradeApi.getWalletTransactionsHistory().then((response) => {
      setTransactions(response);
      // console.log(response);
    });
  }, []);

  return <Table />;
};

export default WalletTransactions;
