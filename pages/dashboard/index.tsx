// Dependencies
import React, {useState} from "react";
import { useIntl } from "react-intl";

// Layouts
import AppLayout from "shared/layouts/AppLayout";

// Components
import { Tabs, Tab, TabPanel } from "zignaly-ui";
import AccountSelector from "components/Dashboard/AccountSelector/AccountSelector";
import DashboardCoins from "components/Dashboard/DashboardCoins/DashboardCoins";

// Constants
import { PRODUCT_NAME } from "lib/constants";

const Dashboard = () => {
  // Hooks
  const intl = useIntl();

  // State
  const [value, setValue] = useState(0);

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  const title = `${intl.formatMessage({ id: "dashboard" })} | ${intl.formatMessage({ id: "dashboard.positions" })} | ${PRODUCT_NAME}`;

  return (
    <AppLayout title={title}>
      <AccountSelector />
      <Tabs onChange={handleChange} value={value}>
        <Tab label={intl.formatMessage({ id: "dashboard.myCoins" })} />
      </Tabs>
      <TabPanel index={0} value={value}>
        <DashboardCoins />
      </TabPanel>
    </AppLayout>
  );
};

export default Dashboard;
