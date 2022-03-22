import React, { useState, useEffect } from "react";
import "./Coins.scss";
import { Box, CircularProgress } from "@mui/material";
import CoinsTable from "../../../Balance/Coins/CoinsTable";
import CoinsFilter from "../../../Balance/Coins/CoinsFilter";
import useProviderAssets from "hooks/useProviderAssets";

/**
 *
 * @typedef {import("../../../../services/tradeApiClient.types").ExchangeAsset} ExchangeAsset
 * @typedef {import("../../../../services/tradeApiClient.types").DefaultProviderGetObject} DefaultProviderGetObject
 * @typedef {import("../../../../services/tradeApiClient.types").ExchangeConnectionEntity} ExchangeConnectionEntity
 */
/**
 * @typedef {Object} DefaultProps
 * @property {DefaultProviderGetObject} provider Provider object.
 * @property {ExchangeConnectionEntity} selectedExchange Selected exchange account.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const Coins = ({ provider, selectedExchange }) => {
  const [filteredCoins, setFilteredCoins] = useState(/** @type {Array<ExchangeAsset>} */ (null));
  const assets = useProviderAssets(selectedExchange.internalId, provider.id);
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
          className="providerCoins"
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
        >
          <CoinsTable list={filteredCoins} persistKey="exchangeAssets" title={embedFilter} />
        </Box>
      )}
    </>
  );
};

export default Coins;
