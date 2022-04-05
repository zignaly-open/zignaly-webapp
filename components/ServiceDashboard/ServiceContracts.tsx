import React, { useEffect, useMemo, useState } from "react";
import tradeApi from "services/tradeApiClient";
import useSelectedExchange from "hooks/useSelectedExchange";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "store/actions/ui";
import { Table, IconButton, TableButton, ButtonGroup, OptionsDotsIcon } from "zignaly-ui2";
import { FormattedMessage, useIntl } from "react-intl";
import { Box } from "@mui/material";
import dayjs from "dayjs";
import { ExchangeContractsObject, ExchangeOpenOrdersObject } from "services/tradeApiClient.types";
import styled from "styled-components";
import NumberFormat from "react-number-format";

const Cell = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

const ServiceContracts = () => {
  const selectedExchange = useSelectedExchange();
  const dispatch = useDispatch();
  const [contracts, setContracts] = useState<ExchangeContractsObject[]>(null);
  const intl = useIntl();

  useEffect(() => {
    const payload = {
      exchangeInternalId: selectedExchange.internalId,
      providerId: "6058df72ab6a99353e06e8fc",
    };
    tradeApi
      .providerContractsGet(payload)
      .then((response) => {
        setContracts(response);
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
      contracts
        ? contracts.map((contract) => ({
            date: (
              <Box>
                <div>{dayjs().format("h:mma")}</div>
                <div>{dayjs().format("MMM DD, YYYY")}</div>
              </Box>
            ),
            position: <Cell>{contract.positionId}</Cell>,
            pair: <Cell>{contract.symbol}</Cell>,
            amount: (
              <Cell>
                <NumberFormat value={contract.amount} displayType="text" thousandSeparator={true} />
              </Cell>
            ),
            side: (
              <Cell>
                <FormattedMessage id={`position.side.${contract.side}`} />
              </Cell>
            ),
            entryPrice: (
              <Cell>
                <NumberFormat
                  value={contract.entryprice}
                  displayType="text"
                  thousandSeparator={true}
                />
              </Cell>
            ),
            marketPrice: (
              <Cell>
                <NumberFormat
                  value={contract.markprice}
                  displayType="text"
                  thousandSeparator={true}
                />
              </Cell>
            ),
            margin: <Cell>{contract.margin}</Cell>,
          }))
        : undefined,
    [contracts],
  );

  return <>{contracts && <Table columns={columns} data={data} />}</>;
};

export default ServiceContracts;
