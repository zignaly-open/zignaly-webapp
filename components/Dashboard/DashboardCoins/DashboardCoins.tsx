import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import { Table, IconButton, TableButton, ButtonGroup, PriceLabel } from "zignaly-ui";
import NumberFormat from "react-number-format";
import { useExchangeAssets } from "lib/useAPI";
import CoinIcon from "../../../src/components/WalletView/CoinIcon";
import useUser from "lib/useUser";

import * as styled from "./styles";

const DashboardCoins = () => {
  const intl = useIntl();
  const { selectedExchange } = useUser();
  const { data: balance, error } = useExchangeAssets(selectedExchange?.internalId);

  const columns = useMemo(
    () => [
      {
        Header: intl.formatMessage({ id: "col.coin" }),
        accessor: "coin",
      },
      {
        Header: intl.formatMessage({ id: "col.coins.total" }),
        accessor: "totalBalance",
      },
      {
        Header: intl.formatMessage({ id: "col.coins.available" }),
        accessor: "availableBalance",
      },
      {
        Header: intl.formatMessage({ id: "col.coins.locked" }),
        accessor: "lockedBalance",
      },
      {
        Header: intl.formatMessage({ id: "col.totalValueBTC" }),
        accessor: "totalBTC",
      },
      {
        Header: intl.formatMessage({ id: "col.totalValueUSD" }),
        accessor: "totalUSD",
      },
    ],
    [],
  );

  const data = useMemo(
    () =>
      balance
        ? Object.entries(balance)
            .sort((a, b) => parseFloat(b[1].balanceTotalUSDT) - parseFloat(a[1].balanceTotalUSDT))
            .map(([coin, balanceData]) => ({
              coin: (
                <styled.CoinCell>
                  <CoinIcon coin="BTC" />
                  <Box
                    display="flex"
                    flexDirection="column"
                    ml="8px"
                    alignItems="flex-start"
                    // style={{ minWidth: "140px" }}
                  >
                    <Typography style={{ lineHeight: "20px" }}>{coin}</Typography>
                    <styled.TypographySecondary>{balanceData.name}</styled.TypographySecondary>
                  </Box>
                </styled.CoinCell>
              ),
              totalBalance: <PriceLabel token={coin} value={balanceData.balanceTotal} />,
              availableBalance: <PriceLabel token={coin} value={balanceData.balanceFree} />,
              lockedBalance: <PriceLabel token={coin} value={balanceData.balanceLocked} />,
              totalBTC: <PriceLabel token={coin} value={balanceData.balanceTotalBTC} />,
              totalUSD: (
                <NumberFormat
                  value={balanceData.balanceTotalUSDT}
                  displayType="text"
                  thousandSeparator={true}
                  prefix="$"
                  decimalScale={2}
                />
              ),
              action: (
                <ButtonGroup>
                  <TableButton caption={"Deposit"} />
                  <TableButton caption={"Withdraw"} />
                </ButtonGroup>
              ),
            }))
        : undefined,
    [balance],
  );

  return <>{balance && <Table columns={columns} data={data} />}</>;
};

export default DashboardCoins;
