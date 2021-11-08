import { Box, CircularProgress, Tooltip, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { AlignCenter } from "styles/styles";
import { FormattedMessage, useIntl } from "react-intl";
import NumberFormat from "react-number-format";
import Table, { TableLayout } from "./Table";
import styled from "styled-components";
import tradeApi from "services/tradeApiClient";
import CustomButton from "components/CustomButton";

const TypographyAmount = styled(Typography)`
  font-weight: 600;
  font-size: 16px;
`;

const TypographySeconday = styled(Typography)`
  font-size: 12px;
  color: #65647e;
`;

const TypographyToken = styled(TypographySeconday)`
  font-weight: 600;
  margin-left: 4px;
`;

const Button = styled(CustomButton)`
  margin-right: 8px;
  min-width: 121px;
`;

const CoinIcon = ({
  coin,
  width = 32,
  height = 32,
}: {
  coin: string;
  width?: number;
  height?: number;
}) => {
  const [image, setImage] = useState(null);
  useEffect(() => {
    import(`../../images/coins/${coin.toLowerCase()}.svg`).then((img) => {
      setImage(img);
    });
  }, []);

  return image && <img src={image.default} width={width} height={height} />;
};
interface WalletCoinsProps {
  walletBalance: WalletBalance;
}

const WalletCoins = ({ walletBalance }: WalletCoinsProps) => {
  const intl = useIntl();

  // const balanceEntries = Object.entries(balance || {});

  // useEffect(() => {
  //   if (balance) {
  //     balanceEntries.forEach(([coin]) => {
  //       tradeApi.convertPreview({ from: coin, to: "USDT", qty: 1 }).then((response) => {
  //         setRateZIG(response.lastPrice);
  //       });
  //     });
  //   }
  // }, [balance]);

  if (!walletBalance) {
    return <CircularProgress color="primary" size={40} />;
  }

  const columns = [
    {
      Header: intl.formatMessage({ id: "col.coin" }),
      accessor: "coin",
    },
    {
      Header: intl.formatMessage({ id: "col.value" }),
      accessor: "value",
    },
    {
      Header: intl.formatMessage({ id: "col.actions" }),
      id: "actions",
      Cell: ({ row }) => (
        <AlignCenter>
          <Tooltip title={<FormattedMessage id="wallet.fees.cashback.soon" />}>
            <div>
              <Button className="textPurple" disabled style={{ opacity: 0.4 }}>
                <FormattedMessage id="accounts.withdraw" />
              </Button>
            </div>
          </Tooltip>
          <Tooltip title={<FormattedMessage id="wallet.fees.cashback.soon" />}>
            <div>
              <Button className="textPurple borderPurple">
                <FormattedMessage id="accounts.deposit" />
              </Button>
            </div>
          </Tooltip>
        </AlignCenter>
      ),
    },
  ];

  const makeData = (coin: string, networkBalance: string) => ({
    coin: (
      <AlignCenter>
        <CoinIcon coin={coin} />
        <Box display="flex" flexDirection="column" ml="16px">
          <Box display="flex" alignItems="center" mb="4px">
            <TypographyAmount>
              <NumberFormat value={networkBalance} displayType="text" thousandSeparator={true} />
            </TypographyAmount>
            <TypographyToken>{coin}</TypographyToken>
          </Box>
          <TypographySeconday>Todo</TypographySeconday>
        </Box>
      </AlignCenter>
    ),
    value: (
      <AlignCenter direction={"column"}>
        <Typography style={{ fontWeight: 600 }}>
          <NumberFormat prefix="$" value={0} displayType="text" thousandSeparator={true} />
          &nbsp;(todo)
        </Typography>
      </AlignCenter>
    ),
  });

  const data = Object.entries(walletBalance).reduce((accData, [coin, networkBalances]) => {
    Object.entries(networkBalances).forEach(([key, networkBalance]) => {
      if (key !== "total") {
        accData.push(makeData(coin, networkBalance));
      }
    });
    return accData;
  }, []);

  return (
    <TableLayout>
      <Table data={data} columns={columns} />
    </TableLayout>
  );
};

export default WalletCoins;
