import { TabPanel } from "@material-ui/lab";
import { Box, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import ServiceContracts from "./ServiceContracts";
import ServiceOrders from "./ServiceOrders";
import ServicePositions from "./ServicePositions";

const ServiceDashboard = () => {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Item One" />
          <Tab label="Item 2" />
          <Tab label="Item 3" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      <ServicePositions />
      <br />
      <ServiceOrders />
      <br />
      <ServiceContracts />
    </>
  );
};

export default ServiceDashboard;
