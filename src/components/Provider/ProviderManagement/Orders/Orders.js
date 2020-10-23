import React, { useState, useEffect, useContext } from "react";
import "./Orders.scss";
import { Box, CircularProgress } from "@material-ui/core";
import { useDispatch } from "react-redux";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import tradeApi from "../../../../services/tradeApiClient";
import { showErrorAlert } from "../../../../store/actions/ui";
import OrdersTable from "./OrdersTable";
import useStoreSettingsSelector from "../../../../hooks/useStoreSettingsSelector";

/**
 * @typedef {import("../../../../services/tradeApiClient.types").DefaultProviderGetObject} DefaultProviderGetObject
 * @typedef {Object} DefaultProps
 * @property {DefaultProviderGetObject} provider Balance
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const Orders = ({ provider }) => {
  const [loading, setLoading] = useState(false);
  const { selectedExchange } = useStoreSettingsSelector();
  const storeSession = useStoreSessionSelector();
  const [list, setList] = useState([]);
  const dispatch = useDispatch();

  const loadData = () => {
    setLoading(true);
    const payload = {
      token: storeSession.tradeApi.accessToken,
      exchangeInternalId: selectedExchange.internalId,
    };
    tradeApi
      .openOrdersGet(payload)
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
          <OrdersTable
            list={list}
            loadData={loadData}
            selectedAccount={selectedExchange}
            title=""
          />
        </Box>
      )}
    </>
  );
};

export default Orders;
