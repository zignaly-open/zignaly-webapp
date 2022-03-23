import { Box, Button, Tab, Tabs, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import { useIntl } from "react-intl";
// import ServiceContracts from "./ServiceContracts";
// import ServiceOrders from "./ServiceOrders";
import ServicePositions from "./ServicePositions";
// import TabPanel from "@mui/lab/TabPanel";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const ServiceDashboard = () => {
  const intl = useIntl();
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      {/* <TabContext value={value}> */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label={intl.formatMessage({ id: "dashboard.openPositions" })} />
          <Tab label={intl.formatMessage({ id: "dashboard.closedPositions" })} />
          <Tab label={intl.formatMessage({ id: "dashboard.exchangeOrders" })} />
          <Tab label={intl.formatMessage({ id: "accounts.contracts" })} />
          <Tab label={intl.formatMessage({ id: "dashboard.positions.log" })} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <ServicePositions />
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      {/* </TabContext> */}
      {/* <ServicePositions />
      <br />
      <ServiceOrders />
      <br />
      <ServiceContracts /> */}
    </>
  );
};

export default ServiceDashboard;
