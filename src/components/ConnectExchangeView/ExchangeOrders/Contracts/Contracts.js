import React, { useState, useEffect, useContext } from "react";
import "./Contracts.scss";
import { Box, CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import tradeApi from "../../../../services/tradeApiClient";
import { showErrorAlert } from "../../../../store/actions/ui";
import ModalPathContext from "../../ModalPathContext";
import ContractsTable from "./ContractsTable";

const Contracts = () => {
  const {
    pathParams: { selectedAccount },
  } = useContext(ModalPathContext);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const dispatch = useDispatch();

  const loadData = () => {
    setLoading(true);
    tradeApi
      .exchangeContractsGet(selectedAccount.internalId)
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
            persistKey="contractsTable"
            selectedAccount={selectedAccount}
            title=""
          />
        </Box>
      )}
    </>
  );
};

export default Contracts;
