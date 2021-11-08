import { CircularProgress } from "@material-ui/core";
import React from "react";
import { AlignCenter } from "react-feather";
import { useIntl } from "react-intl";
import Table, { TableLayout } from "./Table";

interface WalletCoinsProps {
  coins: WalletCoins;
  balance: Record<string, string>;
}

const WalletCoins = ({ coins, balance }: WalletCoinsProps) => {
  const intl = useIntl();

  if (!coins) {
    return <CircularProgress color="primary" size={40} />;
  }

  const columns = [
    {
      Header: intl.formatMessage({ id: "col.coin" }),
      accessor: "coin",
    },
    {
      Header: intl.formatMessage({ id: "col.amount" }),
      accessor: "amount",
    },
    {
      Header: intl.formatMessage({ id: "col.actions" }),
      accessor: "actions",
    },
  ];

  const data = Object.entries(coins).map((c) => ({
    coin: (
      <AlignCenter>
        {/* <img width={24} height={24} src={ZIGIcon} /> */}
        {/* <TypographyToken>{t.currency}</TypographyToken> */}
      </AlignCenter>
    ),
  }));

  return (
    <TableLayout>
      <Table data={data} columns={columns} />
    </TableLayout>
  );
};

export default WalletCoins;
