import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import tradeApi from "services/tradeApiClient";
import useSelectedExchange from "hooks/useSelectedExchange";
import { Table, IconButton, TableButton, ButtonGroup, OptionsDotsIcon } from "zignaly-ui";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "store/actions/ui";
import styled, { css } from "styled-components";
import CoinIcon from "components/WalletView/CoinIcon";
import NumberFormat from "react-number-format";
import dayjs from "dayjs";
import { ManagementPositionsEntity } from "services/tradeApiClient.types";

const Cell = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

const TypographyCoin = styled(Typography)`
  font-weight: 600;
  margin-left: 4px;
  font-size: 12px;
  color: #706f82;
`;

const ProfitPercent = styled.span`
  color: ${(props) => (props.positive ? "#26C4C1" : "#26C4C1")};
  font-size: 12px;
  margin-top: 2px;
`;

const renderProfit = (position: ManagementPositionsEntity["position"]) => {
  return (
    <>
      {position.status === 1 ? (
        <span>
          <FormattedMessage id="dashboard.positions.entering" />
        </span>
      ) : (
        <Cell flexDirection="column">
          <Box display="flex" alignItems="center">
            <NumberFormat
              value={position.profit}
              displayType="text"
              thousandSeparator={true}
              decimalScale={2}
            />
            <TypographyCoin>{position.quote}</TypographyCoin>
          </Box>
          <ProfitPercent positive={Boolean(position.profitPercentage)}>
            <NumberFormat
              value={position.profitPercentage}
              displayType="text"
              thousandSeparator={true}
              decimalScale={2}
              suffix="%"
            />
          </ProfitPercent>
        </Cell>
      )}
    </>
  );
};

const ServicePositions = () => {
  useEffect(() => {
    tradeApi
      .servicePositions("6058df72ab6a99353e06e8fc")
      .then((response) => {
        setPositions(response);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  }, []);

  const selectedExchange = useSelectedExchange();
  const [positions, setPositions] = useState(null);
  const dispatch = useDispatch();
  const intl = useIntl();

  const columns = useMemo(
    () => [
      {
        Header: intl.formatMessage({ id: "col.opened" }),
        accessor: "openDate",
      },
      {
        Header: intl.formatMessage({ id: "col.amount" }),
        accessor: "amount",
      },
      {
        Header: intl.formatMessage({ id: "col.pair" }),
        accessor: "pair",
      },
      {
        Header: intl.formatMessage({ id: "col.pnl" }),
        accessor: "profit",
      },
      {
        Header: intl.formatMessage({ id: "col.entryPrice" }),
        accessor: "buyPrice",
      },
      {
        Header: intl.formatMessage({ id: "col.invested" }),
        accessor: "invested",
      },
      { Header: intl.formatMessage({ id: "col.side" }), accessor: "side" },
      {
        Header: (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton icon={OptionsDotsIcon} size="large" />
          </div>
        ),
        accessor: "action",
        disableSortBy: true,
      },
    ],
    [],
  );
  const data = useMemo(
    () =>
      positions
        ? positions
            .sort((a, b) => a.openDate - b.openDate)
            .map((position) => ({
              openDate: (
                <Box>
                  <div>{dayjs(position.openDate).format("h:mma")}</div>
                  <div>{dayjs(position.openDate).format("MMM DD, YYYY")}</div>
                </Box>
              ),
              amount: (
                <Cell>
                  <NumberFormat
                    value={position.amount}
                    displayType="text"
                    thousandSeparator={true}
                  />
                </Cell>
              ),
              pair: <Cell>{position.pair}</Cell>,
              profit: renderProfit(position),
              buyPrice: (
                <Cell>
                  <NumberFormat
                    value={position.buyPrice}
                    displayType="text"
                    thousandSeparator={true}
                  />
                </Cell>
              ),
              invested: (
                <Cell>
                  <NumberFormat
                    value={position.positionSizeQuote}
                    displayType="text"
                    thousandSeparator={true}
                    decimalScale={2}
                  />
                  <TypographyCoin>{position.quote}</TypographyCoin>
                </Cell>
              ),
              side: (
                <Cell>
                  <FormattedMessage
                    id={`${position.side === "SHORT" ? "fil.type.short" : "fil.type.long"}`}
                  />
                </Cell>
              ),
            }))
        : undefined,
    [positions],
  );

  return <>{positions && <Table columns={columns} data={data} />}</>;
};

export default ServicePositions;
