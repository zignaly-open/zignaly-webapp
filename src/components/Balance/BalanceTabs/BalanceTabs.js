import React, { useState } from "react";
import { Box } from "@material-ui/core";
import TabsMenu from "./TabsMenu";
import "./BalanceTabs.scss";
import History from "../History";

/**
 * @typedef {import("../../../services/tradeApiClient.types").DefaultDailyBalanceEntity} DefaultDailyBalanceEntity
 * @typedef {import("../../../services/tradeApiClient.types").UserBalanceEntity} UserBalanceEntity
 * @typedef {Object} DefaultProps
 * @property {DefaultDailyBalanceEntity} dailyBalance Daily balance.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const BalanceTabs = ({ dailyBalance }) => {
  const [tabValue, setTabValue] = useState(0);

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
    <Box bgcolor="grid.content" className="balanceTabs">
      <Box
        alignItems="flex-start"
        className="tabsBox"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        <TabsMenu changeTab={changeTab} tabValue={tabValue} />
        {tabValue === 0 && (
          <Box className="tabPanel">
            <History dailyBalance={dailyBalance} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BalanceTabs;
