import React, { useState, useEffect } from "react";
import "./Contracts.scss";
import { Box, CircularProgress } from "@material-ui/core";
import { useDispatch } from "react-redux";
import tradeApi from "../../../../services/tradeApiClient";
import { showErrorAlert } from "../../../../store/actions/ui";
import ContractsTable from "../../../ConnectExchangeView/ExchangeOrders/Contracts/ContractsTable";
import useSelectedExchange from "hooks/useSelectedExchange";

/**
 * @typedef {import("../../../../services/tradeApiClient.types").DefaultProviderGetObject} DefaultProviderGetObject
 * @typedef {Object} DefaultProps
 * @property {DefaultProviderGetObject} provider Balance
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const Contracts = ({ provider }) => {
  const [loading, setLoading] = useState(false);
  const selectedExchange = useSelectedExchange();
  const [list, setList] = useState([]);
  const dispatch = useDispatch();

  const loadData = () => {
    setLoading(true);
    const payload = {
      exchangeInternalId: selectedExchange.internalId,
      providerId: provider.id,
    };
    tradeApi
      .providerContractsGet(payload)
      .then((response) => {
        setList(response);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(loadData, []);

  return (
    <>
      {loading && (
        <Box
          alignItems="center"
          className="loadingBox"
          display="flex"
          flexDirection="row"
          justifyContent="center"
        >
          <CircularProgress color="primary" size={40} />
        </Box>
      )}
      {!loading && (
        <Box
          alignItems="flex-start"
          className="orders"
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
        >
          <ContractsTable
            list={list}
            loadData={loadData}
            persistKey="providerContracts"
            provider={provider}
            selectedAccount={selectedExchange}
            title=""
          />
        </Box>
      )}
    </>
  );
};

export default Contracts;
