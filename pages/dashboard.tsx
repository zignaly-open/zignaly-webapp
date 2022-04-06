import { Container } from "@mui/material";
import Head from "next/head";
import MainLayout from "../components/MainLayout";
import { useIntl } from "react-intl";
import { PRODUCT_NAME } from "../lib/constants";
import DashboardCoins from "../components/Dashboard/DashboardCoins";
import { Tabs, Tab, TabPanel } from "zignaly-ui";
import { useState } from "react";

type Props = {};

const Dashboard = ({}: Props) => {
  const intl = useIntl();
  const [value, setValue] = useState(0);
  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  return (
    <MainLayout>
      <Container maxWidth="lg">
        <Head>
          <title>{`${intl.formatMessage({ id: "dashboard" })} | ${intl.formatMessage({
            id: "dashboard.positions",
          })} | ${PRODUCT_NAME}`}</title>
        </Head>
        <Tabs value={value} onChange={handleChange}>
          <Tab label={intl.formatMessage({ id: "management.coins" })} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <DashboardCoins />
        </TabPanel>
      </Container>
    </MainLayout>
  );
};

export default Dashboard;
