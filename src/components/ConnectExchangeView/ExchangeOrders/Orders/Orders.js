import React, { useState, useEffect, useContext } from "react";
import "./Orders.scss";
import { Box, CircularProgress } from "@material-ui/core";
import { useDispatch } from "react-redux";
import tradeApi from "../../../../services/tradeApiClient";
import { showErrorAlert } from "../../../../store/actions/ui";
import ModalPathContext from "../../ModalPathContext";
import OrdersTable from "./OrdersTable";

const Orders = () => {
  const {
    pathParams: { selectedAccount },
  } = useContext(ModalPathContext);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const dispatch = useDispatch();

  const loadData = () => {
    setLoading(true);
    tradeApi
      .openOrdersGet(selectedAccount.internalId)
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
            persistKey="ordersTable"
            selectedAccount={selectedAccount}
            title=""
          />
        </Box>
      )}
    </>
  );
};

export default Orders;
