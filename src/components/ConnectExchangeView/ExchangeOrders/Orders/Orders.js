import React, { useState, useEffect, useContext } from "react";
import "./Orders.scss";
import { Box, CircularProgress } from "@material-ui/core";
import { useDispatch } from "react-redux";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import tradeApi from "../../../../services/tradeApiClient";
import { showErrorAlert } from "../../../../store/actions/ui";
import ModalPathContext from "../../ModalPathContext";
import OrdersTable from "./OrdersTable";

const Orders = () => {
  const {
    pathParams: { selectedAccount },
  } = useContext(ModalPathContext);
  const [loading, setLoading] = useState(false);
  const storeSession = useStoreSessionSelector();
  const [list, setList] = useState([]);
  const dispatch = useDispatch();

  const loadData = () => {
    setLoading(true);
    const payload = {
      token: storeSession.tradeApi.accessToken,
      exchangeInternalId: selectedAccount.internalId,
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
          <OrdersTable list={list} title="" selectedAccount={selectedAccount} loadData={loadData} />
        </Box>
      )}
    </>
  );
};

export default Orders;
