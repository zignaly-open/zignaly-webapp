import React, { useState, useEffect } from "react";
import "./Coins.scss";
import { Box, CircularProgress } from "@mui/material";
import CoinsTable from "./CoinsTable";
import useUserExchangeAssets from "../../../hooks/useUserExchangeAssets";
import CoinsFilter from "./CoinsFilter";
import useSelectedExchange from "hooks/useSelectedExchange";

/**
 *
 * @typedef {import("../../../services/tradeApiClient.types").ExchangeAsset} ExchangeAsset
 */

const Coins = () => {
  const [filteredCoins, setFilteredCoins] = useState(/** @type {Array<ExchangeAsset>} */ (null));
  const selectedExchange = useSelectedExchange();
  const [updatedAt, setUpdatedAt] = useState(null);
  const assets = useUserExchangeAssets(selectedExchange.internalId, updatedAt);
  const coins = assets ? Object.values(assets) : null;
  const [filterChecked, setFilterChecked] = useState(false);

  const initData = () => {
    if (assets) {
      filterCoins(filterChecked);
    }
  };
  useEffect(initData, [assets]);

  /**
   * @param {boolean} checked
   * @returns {void}
   */
  const filterCoins = (checked) => {
    if (coins) {
      setFilteredCoins(
        checked ? coins.filter((item) => parseFloat(item.balanceTotalUSDT) > 1) : coins,
      );
    }
  };

  /**
   * @param {React.ChangeEvent<HTMLInputElement>} e event
   */
  const handleFilterChecked = (e) => {
    setFilterChecked(e.target.checked);
    filterCoins(e.target.checked);
  };

  const embedFilter = <CoinsFilter checked={filterChecked} onChange={handleFilterChecked} />;

  return (
    <>
      {!filteredCoins ? (
        <Box
          alignItems="center"
          className="loadingBox"
          display="flex"
          flexDirection="row"
          justifyContent="center"
        >
          <CircularProgress color="primary" size={40} />
        </Box>
      ) : (
        <Box
          alignItems="flex-start"
          className="coins"
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
        >
          <CoinsTable
            onRefreshCoins={() => setUpdatedAt(new Date())}
            list={filteredCoins}
            persistKey="exchangeAssets"
            title={embedFilter}
          />
        </Box>
      )}
    </>
  );
};

export default Coins;
