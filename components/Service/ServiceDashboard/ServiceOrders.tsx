import React, { useEffect, useMemo, useState } from "react";
import tradeApi from "services/tradeApiClient";
import useSelectedExchange from "hooks/useSelectedExchange";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "store/actions/ui";
import {
  Table,
  IconButton,
  TableButton,
  ButtonGroup,
  OptionsDotsIcon,
  DateLabel,
} from "zignaly-ui";
import { FormattedMessage, useIntl } from "react-intl";
import { Box } from "@mui/material";
import dayjs from "dayjs";
import { ExchangeOpenOrdersObject } from "services/tradeApiClient.types";
import styled from "styled-components";
import NumberFormat from "react-number-format";
import { useServiceOrders } from "../../../lib/useAPI";

const Cell = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

const ServiceOrders = () => {
  const selectedExchange = useSelectedExchange();
  const intl = useIntl();
  const { data: orders, error } = useServiceOrders(
    selectedExchange.internalId || "Zignaly1629446605_611f61cd2d6b4",
    "612f43288aedc6362e6f7745",
  );

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
    ],
    [],
  );
  const data = useMemo(
    () =>
      orders
        ? orders.map((order) => ({
            date: <DateLabel date={new Date()} />,
            orderId: order.orderId,
            pair: order.symbol,
            amount: (
              <NumberFormat value={order.amount} displayType="text" thousandSeparator={true} />
            ),
            status: order.status,
            price: <NumberFormat value={order.price} displayType="text" thousandSeparator={true} />,
            side: <FormattedMessage id={`position.side.${order.side}`} />,
            type: order.type,
          }))
        : undefined,
    [orders],
  );

  return <>{orders && <Table columns={columns} data={data} />}</>;
};

export default ServiceOrders;
