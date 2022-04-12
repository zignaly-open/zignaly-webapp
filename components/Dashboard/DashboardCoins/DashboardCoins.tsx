import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import { Table, IconButton, TableButton, ButtonGroup, PriceLabel } from "zignaly-ui-test";
import NumberFormat from "react-number-format";
import { useExchangeAssets } from "lib/useAPI";
import useUser from "lib/useUser";
import * as styled from "./styles";
import Loader from "components/Loader/Loader";
import CoinIcon from "components/CoinIcon";

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
            // todo: remove once sorting fixed
            .sort((a, b) => parseFloat(b[1].balanceTotalUSDT) - parseFloat(a[1].balanceTotalUSDT))
            .map(([coin, coinBalance]) => ({
              coin: (
                <styled.CoinCell>
                  <CoinIcon coin={coin} />
                  <Box display="flex" flexDirection="column" ml="12px" alignItems="flex-start">
                    <Typography style={{ lineHeight: "20px" }}>{coin}</Typography>
                    <styled.TypographySecondary>{coinBalance.name}</styled.TypographySecondary>
                  </Box>
                </styled.CoinCell>
              ),
              totalBalance: <PriceLabel token={coin} value={coinBalance.balanceTotal} />,
              availableBalance: <PriceLabel token={coin} value={coinBalance.balanceFree} />,
              lockedBalance: <PriceLabel token={coin} value={coinBalance.balanceLocked} />,
              totalBTC: <PriceLabel token={coin} value={coinBalance.balanceTotalBTC} />,
              totalUSD: (
                <NumberFormat
                  value={coinBalance.balanceTotalUSDT}
                  displayType="text"
                  thousandSeparator={true}
                  prefix="$"
                  decimalScale={2}
                />
              ),
              action: (
                <ButtonGroup>
                  <TableButton caption="Deposit" />
                  <TableButton caption="Withdraw" />
                </ButtonGroup>
              ),
            }))
        : undefined,
    [balance],
  );

  return <>{false ? <Table columns={columns} data={data} /> : <Loader />}</>;
};

export default DashboardCoins;
