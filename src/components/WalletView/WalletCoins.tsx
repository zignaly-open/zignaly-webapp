import { Box, CircularProgress, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { AlignCenter } from "styles/styles";
import { useIntl } from "react-intl";
import NumberFormat from "react-number-format";
import { getChainIcon } from "utils/chain";
import Table, { TableLayout } from "./Table";
import styled from "styled-components";

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
      Header: intl.formatMessage({ id: "col.value" }),
      accessor: "value",
    },
    {
      Header: intl.formatMessage({ id: "col.actions" }),
      id: "actions",
      Cell: ({ row }) => "a",
    },
  ];

  const makeData = (coin, networkBalance) => ({
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
          <TypographySeconday>Ethe</TypographySeconday>
        </Box>
      </AlignCenter>
    ),
    value: (
      <AlignCenter direction={"column"}>
        <Typography style={{ fontWeight: 600 }}>
          <NumberFormat value={networkBalance} displayType="text" thousandSeparator={true} />
        </Typography>
      </AlignCenter>
    ),
  });

  const data = Object.entries(balance).reduce((accData, [coin, networkBalances]) => {
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
