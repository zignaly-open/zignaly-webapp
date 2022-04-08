import React, { useMemo } from "react";
import { Table, TableButton, ButtonGroup, DateLabel, CloseIcon } from "zignaly-ui";
import { FormattedMessage, useIntl } from "react-intl";
import { Box } from "@mui/material";
import styled from "styled-components";
import NumberFormat from "react-number-format";
import { useContracts } from "../../../lib/useAPI";
import useUser from "lib/useUser";

const ServiceContracts = () => {
  const { user, selectedExchange } = useUser();
  const intl = useIntl();
  const { data: contracts, error } = useContracts(
    selectedExchange?.internalId || "Zignaly1629446605_611f61cd2d6b4",
    "612f43288aedc6362e6f7745",
  );

  const columns = useMemo(
    () => [
      {
        Header: intl.formatMessage({ id: "col.date" }),
        accessor: "date",
      },
      {
        Header: intl.formatMessage({ id: "col.positionid" }),
        accessor: "position",
      },
      {
        Header: intl.formatMessage({ id: "col.pair" }),
        accessor: "pair",
      },
      {
        Header: intl.formatMessage({ id: "col.amount" }),
        accessor: "amount",
      },
      { Header: intl.formatMessage({ id: "col.side" }), accessor: "side" },
      { Header: intl.formatMessage({ id: "col.entryprice" }), accessor: "entryPrice" },
      { Header: intl.formatMessage({ id: "col.price.market" }), accessor: "marketPrice" },
      { Header: intl.formatMessage({ id: "col.margin" }), accessor: "margin" },
    ],
    [],
  );
  const data = useMemo(
    () =>
      contracts
        ? contracts.map((contract) => ({
            date: <DateLabel date={new Date()} />,
            position: contract.position,
            pair: contract.symbol,
            amount: (
              <NumberFormat value={contract.amount} displayType="text" thousandSeparator={true} />
            ),
            side: <FormattedMessage id={`position.side.${contract.side}`} />,
            entryPrice: (
              <NumberFormat
                value={contract.entryprice}
                displayType="text"
                thousandSeparator={true}
              />
            ),
            marketPrice: (
              <NumberFormat
                value={contract.markprice}
                displayType="text"
                thousandSeparator={true}
              />
            ),
            margin: contract.margin,
            action: (
              <ButtonGroup>
                <TableButton icon={CloseIcon} caption={"Close"} />
              </ButtonGroup>
            ),
          }))
        : undefined,
    [contracts],
  );

  return <>{contracts && <Table columns={columns} data={data} />}</>;
};

export default ServiceContracts;
