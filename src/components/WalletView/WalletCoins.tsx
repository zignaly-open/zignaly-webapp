import { CircularProgress, Typography } from "@material-ui/core";
import React from "react";
import { AlignCenter } from "react-feather";
import { useIntl } from "react-intl";
import NumberFormat from "react-number-format";
import Table, { TableLayout } from "./Table";

interface WalletCoinsProps {
  balance: Record<string, string>;
}

const WalletCoins = ({ balance }: WalletCoinsProps) => {
  const intl = useIntl();

  if (!balance) {
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

  console.log(Object.entries(balance));
  const data = Object.entries(balance).map((c) => ({
    coin: (
      <AlignCenter>
        {/* <img width={24} height={24} src={ZIGIcon} /> */}
        {/* <TypographyToken>{t.currency}</TypographyToken> */}
      </AlignCenter>
    ),
    // amount: (
    //   <AlignCenter direction={"column"}>
    //     <Typography style={{ fontWeight: 600 }}>
    //       <NumberFormat
    //         value={}
    //         displayType="text"
    //         thousandSeparator={true}
    //         prefix={parseFloat(t.formattedAmount) > 0 && "+"}
    //       />
    //     </Typography>
    //   </AlignCenter>
    // ),
  }));

  return (
    <TableLayout>
      <Table data={data} columns={columns} />
    </TableLayout>
  );
};

export default WalletCoins;
