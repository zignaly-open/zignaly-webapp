import React, { useContext, useMemo } from "react";
import { Table, DateLabel } from "zignaly-ui";
import { FormattedMessage, useIntl } from "react-intl";
import NumberFormat from "react-number-format";
import { useServiceOrders } from "../../../lib/hooks/useAPI";
import useUser from "lib/hooks/useUser";
import { ServiceContext } from "../ServiceContext";
import Loader from "components/common/Loader/Loader";

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
              <NumberFormat displayType="text" thousandSeparator={true} value={order.amount} />
            ),
            status: order.status,
            price: <NumberFormat displayType="text" thousandSeparator={true} value={order.price} />,
            side: <FormattedMessage id={`position.side.${order.side}`} />,
            type: order.type,
          }))
        : undefined,
    [orders],
  );

  return <>{orders ? <Table columns={columns} data={data} /> : <Loader />}</>;
};

export default ServiceOrders;
