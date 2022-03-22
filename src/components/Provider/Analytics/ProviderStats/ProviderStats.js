import React, { useState, useEffect } from "react";
import "./ProviderStats.scss";
import { Box } from "@mui/material";
import StatsFilter from "./StatsFilter";
import StatsTable from "./StatsTable";

/**
 *
 * @typedef {import("../../../../services/tradeApiClient.types").ProfileProviderStatsSignalsObject} ProfileProviderStatsSignalsObject
 * @typedef {Object} DefaultProps
 * @property {Array<ProfileProviderStatsSignalsObject>} data
 */

/**
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} JSX Component.
 */
const ProviderStats = ({ data }) => {
  const [list, setList] = useState([]);

  const initData = () => {
    setList(data);
  };

  useEffect(initData, [data]);

  /**
   * @param {Array<ProfileProviderStatsSignalsObject>} filtered Filtered equity data.
   * @returns {void}
   */
  const handleChange = (filtered) => {
    setList(filtered);
  };

  const embedFilter = <StatsFilter list={data} onChange={handleChange} />;

  return (
    <Box
      alignItems="flex-start"
      className="providerStats"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      <StatsTable list={list} persistKey="profileProviderStats" title={embedFilter} />
    </Box>
  );
};

export default ProviderStats;
