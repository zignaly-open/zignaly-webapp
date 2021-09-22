import React, { useState } from "react";
import { Box } from "@material-ui/core";
import TabsMenu from "../../../TabsMenu";
import "./ManagementTabs.scss";
import Orders from "../Orders/Orders";
import { FormattedMessage } from "react-intl";
import Contracts from "../Contracts";
import Management from "../Management";
import Coins from "../Coins";
import ManagementTable from "../Management/ManagementTable";

/**
 * @typedef {import("../../../../services/tradeApiClient.types").DefaultProviderGetObject} DefaultProviderGetObject
 * @typedef {import("../../../../services/tradeApiClient.types").ExchangeConnectionEntity} ExchangeConnectionEntity
 * @typedef {import("../../../../services/tradeApiClient.types").ManagementPositionsEntity} ManagementPositionsEntity
 * @typedef {Object} DefaultProps
 * @property {DefaultProviderGetObject} provider Balance
 * @property {ExchangeConnectionEntity} selectedExchange Selected exchange account.
 * @property {Array<Position>} [tablePositions] management table positions
 * @property {Array<ManagementPositionsEntity>} [allPositions] all positions with subpositions for management table
 * @property {Function} [loadData] reload positions data.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ManagementTabs = ({ provider, selectedExchange, tablePositions, allPositions, loadData }) => {
  const [tabValue, setTabValue] = useState(0);

  const tabsList = [
    {
      display: true,
      label: <FormattedMessage id="management.positions" />,
    },
    {
      display: provider.profitSharing,
      label: <FormattedMessage id="management.orders" />,
    },
    {
      display: provider.profitSharing && provider.exchangeType.toLowerCase() === "futures",
      label: <FormattedMessage id="management.contracts" />,
    },
    {
      display: provider.profitSharing && provider.exchangeType.toLowerCase() === "spot",
      label: <FormattedMessage id="management.coins" />,
    },
  ];

  /**
   * Event handler to change tab value.
   *
   * @param {React.ChangeEvent<{checked: boolean}>} event Tab index to set active.
   * @param {Number} val Tab index to set active.
   * @returns {void}
   */
  const changeTab = (event, val) => {
    setTabValue(val);
  };

  return (
    <Box bgcolor="grid.content" className="managementTabs">
      <Box
        alignItems="flex-start"
        className="tabsBox"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        <TabsMenu changeTab={changeTab} tabValue={tabValue} tabs={tabsList} />
        {tabValue === 0 && (
          <Box className="tabPanel">
            {provider.profitSharing && provider.exchangeType.toLowerCase() === "spot" ? (
              <ManagementTable
                allPositions={allPositions}
                list={tablePositions}
                provider={provider}
                setLoading={loadData}
              />
            ) : (
              <Management provider={provider} />
            )}
          </Box>
        )}
        {tabValue === 1 && (
          <Box className="tabPanel">
            <Orders provider={provider} />
          </Box>
        )}
        {tabValue === 2 && (
          <Box className="tabPanel">
            {provider.exchangeType.toLowerCase() === "futures" && <Contracts provider={provider} />}
            {provider.exchangeType.toLowerCase() === "spot" && (
              <Coins provider={provider} selectedExchange={selectedExchange} />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ManagementTabs;
