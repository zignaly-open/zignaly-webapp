import React, { useContext, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Table, DateLabel, PriceLabel, PercentageIndicator } from "zignaly-ui";
import NumberFormat from "react-number-format";
import { useServicePositions } from "../../../lib/hooks/useAPI";
import useUser from "lib/hooks/useUser";
import { useSelector } from "react-redux";
import { ServiceContext } from "../ServiceContext";
import Loader from "components/common/Loader/Loader";

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
  const { selectedService } = useContext(ServiceContext);
  const { data: positions, error } = useServicePositions(selectedService.id);
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

  return <>{positions ? <Table columns={columns} data={data} /> : <Loader />}</>;
};

export default ServicePositions;
