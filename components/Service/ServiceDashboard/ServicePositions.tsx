import React, { useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Table, DateLabel, PriceLabel, PercentageIndicator } from "zignaly-ui";
import NumberFormat from "react-number-format";
import { useServicePositions } from "../../../lib/useAPI";

const renderProfit = (position: Position) => {
  return (
    <>
      {position.status === 1 ? (
        <span>
          <FormattedMessage id="dashboard.positions.entering" />
        </span>
      ) : (
        <PriceLabel
          token="USDT"
          value={position.profit}
          bottomElement={<PercentageIndicator value={position.profitPercentage} />}
        />
      )}
    </>
  );
};

const ServicePositions = () => {
  const intl = useIntl();
  const { data: positions, error } = useServicePositions("612f43288aedc6362e6f7745");
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
    ],
    [],
  );
  const data = useMemo(
    () =>
      positions
        ? positions
            .sort((a, b) => a.openDate - b.openDate)
            .map((position) => ({
              openDate: <DateLabel date={new Date(position.openDate)} />,
              amount: (
                <NumberFormat value={position.amount} displayType="text" thousandSeparator={true} />
              ),
              pair: position.pair,
              profit: renderProfit(position),
              buyPrice: (
                <NumberFormat
                  value={position.buyPrice}
                  displayType="text"
                  thousandSeparator={true}
                />
              ),
              invested: <PriceLabel token={position.quote} value={position.positionSizeQuote} />,
              side: (
                <FormattedMessage
                  id={`${position.side === "SHORT" ? "fil.type.short" : "fil.type.long"}`}
                />
              ),
            }))
        : undefined,
    [positions],
  );

  return <>{positions && <Table columns={columns} data={data} />}</>;
};

export default ServicePositions;
