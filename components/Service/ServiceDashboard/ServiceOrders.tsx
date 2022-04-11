import React, { useContext, useMemo } from "react";
import { Table, DateLabel } from "zignaly-ui-test";
import { FormattedMessage, useIntl } from "react-intl";
import NumberFormat from "react-number-format";
import { useServiceOrders } from "../../../lib/useAPI";
import useUser from "lib/useUser";
import { ServiceContext } from "../ServiceContext";

const ServiceOrders = () => {
  const { user, selectedExchange } = useUser();
  const intl = useIntl();
  const { selectedService } = useContext(ServiceContext);
  const { data: orders, error } = useServiceOrders(selectedExchange.internalId, selectedService.id);

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
