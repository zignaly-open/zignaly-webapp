import React, { useState } from "react";
import { useIntl } from "react-intl";
import ServicePositions from "./ServicePositions";
import { Tab, TabPanel, Tabs } from "zignaly-ui";
import ServiceContracts from "./ServiceContracts";
import ServiceOrders from "./ServiceOrders";

const ServiceDashboard = () => {
  const intl = useIntl();
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <Tabs onChange={handleChange} value={value}>
        <Tab label={intl.formatMessage({ id: "services.openPositions" })} />
        <Tab label={intl.formatMessage({ id: "services.closedPositions" })} />
        <Tab label={intl.formatMessage({ id: "service.exchangeOrders" })} />
        <Tab label={intl.formatMessage({ id: "accounts.contracts" })} />
        <Tab label={intl.formatMessage({ id: "dashboard.positions.log" })} />
      </Tabs>
      <TabPanel index={0} value={value}>
        <ServicePositions />
      </TabPanel>
      <TabPanel index={1} value={value}>
        Todo Closed Positions
      </TabPanel>
      <TabPanel index={2} value={value}>
        <ServiceOrders />
      </TabPanel>
      <TabPanel index={3} value={value}>
        <ServiceContracts />
      </TabPanel>
    </>
  );
};

export default ServiceDashboard;
