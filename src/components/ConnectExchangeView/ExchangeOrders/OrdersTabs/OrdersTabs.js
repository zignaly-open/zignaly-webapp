import React, { useState } from "react";
import { Box } from "@material-ui/core";
import TabsMenu from "./TabsMenu";
import "./OrdersTabs.scss";

const OrdersTabs = () => {
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
    <Box bgcolor="grid.content" className="ordersTabs">
      <Box
        alignItems="flex-start"
        className="tabsBox"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        <TabsMenu changeTab={changeTab} tabValue={tabValue} />
        {tabValue === 0 && <Box className="tabPanel"></Box>}
        {tabValue === 1 && <Box className="tabPanel"></Box>}
      </Box>
    </Box>
  );
};

export default OrdersTabs;
