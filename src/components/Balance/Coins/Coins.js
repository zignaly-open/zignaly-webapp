import React, { useState, useEffect } from "react";
import "./Coins.scss";
import { Box, CircularProgress } from "@material-ui/core";
import CoinsTable from "./CoinsTable";
import useUserExchangeAssets from "../../../hooks/useUserExchangeAssets";
import CoinsFilter from "./CoinsFilter";
import useSelectedExchange from "hooks/useSelectedExchange";

/**
 *
 * @typedef {import("../../../services/tradeApiClient.types").ExchangeAsset} ExchangeAsset
 */

const Coins = () => {
  const [list, setList] = useState([]);
  const selectedExchange = useSelectedExchange();
  const assets = useUserExchangeAssets(selectedExchange.internalId);
  const data = Object.values(assets);
  const loading = data.length === 0;

  const initData = () => {
    setList(data);
  };

  useEffect(initData, [assets]);

  /**
   * @param {Array<ExchangeAsset>} filtered Filtered equity data.
   * @returns {void}
   */
  const handleChange = (filtered) => {
    setList(filtered);
  };

  const embedFilter = <CoinsFilter list={data} onChange={handleChange} />;

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
          className="coins"
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
        >
          <CoinsTable list={list} persistKey="exchangeAssets" title={embedFilter} />
        </Box>
      )}
    </>
  );
};

export default Coins;
