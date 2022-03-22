import React, { useEffect, useMemo, useState } from "react";
import tradeApi from "services/tradeApiClient";
import useSelectedExchange from "hooks/useSelectedExchange";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "store/actions/ui";
import { Table, IconButton, TableButton, ButtonGroup, OptionsDotsIcon } from "zignaly-ui";
import { FormattedMessage, useIntl } from "react-intl";
import { Box } from "@material-ui/core";
import dayjs from "dayjs";
import { ExchangeOpenOrdersObject } from "services/tradeApiClient.types";
import styled from "styled-components";
import NumberFormat from "react-number-format";

const Cell = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

const ServiceOrders = () => {
  const selectedExchange = useSelectedExchange();
  const dispatch = useDispatch();
  const [orders, setOrders] = useState<ExchangeOpenOrdersObject[]>(null);
  const intl = useIntl();

  useEffect(() => {
    tradeApi
      // openOrdersGet
      .providerOrdersGet({
        exchangeInternalId: selectedExchange.internalId,
        providerId: "6058df72ab6a99353e06e8fc",
      })
      .then((response) => {
        setOrders(response);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: intl.formatMessage({ id: "col.date" }),
        accessor: "date",
      },
      {
        Header: intl.formatMessage({ id: "col.orders.orderid" }),
        accessor: "orderId",
      },
      {
        Header: intl.formatMessage({ id: "col.pair" }),
        accessor: "pair",
      },
      {
        Header: intl.formatMessage({ id: "col.amount" }),
        accessor: "amount",
      },
      {
        Header: intl.formatMessage({ id: "col.orders.status" }),
        accessor: "status",
      },
      {
        Header: intl.formatMessage({ id: "col.orders.price" }),
        accessor: "price",
      },
      { Header: intl.formatMessage({ id: "col.side" }), accessor: "side" },
      { Header: intl.formatMessage({ id: "col.orders.type" }), accessor: "type" },
      {
        Header: (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton icon={OptionsDotsIcon} />
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
      orders
        ? orders.map((order) => ({
            date: (
              <Box>
                <div>{dayjs(order.datetime).format("h:mma")}</div>
                <div>{dayjs(order.datetime).format("MMM DD, YYYY")}</div>
              </Box>
            ),
            orderId: <Cell>{order.orderId}</Cell>,
            pair: <Cell>{order.symbol}</Cell>,
            amount: (
              <Cell>
                <NumberFormat value={order.amount} displayType="text" thousandSeparator={true} />
              </Cell>
            ),
            status: <Cell>{order.status}</Cell>,
            price: (
              <Cell>
                <NumberFormat value={order.price} displayType="text" thousandSeparator={true} />
              </Cell>
            ),
            side: (
              <Cell>
                <FormattedMessage id={`position.side.${order.side}`} />
              </Cell>
            ),
            type: <Cell>{order.type}</Cell>,
          }))
        : undefined,
    [orders],
  );

  return <>{orders && <Table columns={columns} data={data} />}</>;
};

export default ServiceOrders;
