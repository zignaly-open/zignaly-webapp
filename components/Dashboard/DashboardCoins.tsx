import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import tradeApi from "services/tradeApiClient";
import { Table, IconButton, TableButton, ButtonGroup, OptionsDotsIcon } from "zignaly-ui";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "store/actions/ui";
import styled, { css } from "styled-components";
import NumberFormat from "react-number-format";
import Dashboard from "../../pages/dashboard";
import { useExchangeAssets } from "../../lib/useAPI";
import CoinIcon from "../../src/components/WalletView/CoinIcon";
import useSelectedExchange from "../../src/hooks/useSelectedExchange";

const CoinCell = styled.div`
  display: flex;
  margin-left: 42px;
  align-items: center;
  justify-content: center;
`;

const TypographySecondary = styled(Typography)`
  font-weight: 600;
  font-size: 12px;
  color: #706f82;
  margin-top: 4px;
`;

const TypographyCoin = styled(Typography)`
  font-weight: 600;
  margin-left: 4px;
  font-size: 12px;
  color: #706f82;
`;

const CellValue = styled.div`
  display: flex;
  font-weight: 600;
  font-size: 16px;
  justify-content: center;
  align-items: center;
`;

const DashboardCoins = () => {
  const intl = useIntl();
  const selectedExchange = useSelectedExchange();
  const { data: balance, error } = useExchangeAssets(
    selectedExchange.internalId || "Zignaly1629446605_611f61cd2d6b4",
  );

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
                <CoinCell>
                  <CoinIcon coin="BTC" />
                  <Box
                    display="flex"
                    flexDirection="column"
                    ml="8px"
                    alignItems="flex-start"
                    style={{ minWidth: "140px" }}
                  >
                    <Typography style={{ lineHeight: "20px" }}>{coin}</Typography>
                    <TypographySecondary>{balanceData.name}</TypographySecondary>
                  </Box>
                </CoinCell>
              ),
              totalBalance: (
                <CellValue>
                  <NumberFormat
                    value={balanceData.balanceTotal}
                    displayType="text"
                    thousandSeparator={true}
                  />
                  <TypographyCoin>{coin}</TypographyCoin>
                </CellValue>
              ),
              availableBalance: (
                <CellValue>
                  <NumberFormat
                    value={balanceData.balanceFree}
                    displayType="text"
                    thousandSeparator={true}
                  />
                  <TypographyCoin>{coin}</TypographyCoin>
                </CellValue>
              ),
              lockedBalance: (
                <CellValue>
                  <NumberFormat
                    value={balanceData.balanceLocked}
                    displayType="text"
                    thousandSeparator={true}
                  />
                  <TypographyCoin>{coin}</TypographyCoin>
                </CellValue>
              ),
              totalBTC: (
                <CellValue>
                  <NumberFormat
                    value={balanceData.balanceTotalBTC}
                    displayType="text"
                    thousandSeparator={true}
                  />
                  <TypographyCoin>{coin}</TypographyCoin>
                </CellValue>
              ),
              totalUSD: (
                <CellValue>
                  <NumberFormat
                    value={balanceData.balanceTotalUSDT}
                    displayType="text"
                    thousandSeparator={true}
                    prefix="$"
                    decimalScale={2}
                  />
                </CellValue>
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
