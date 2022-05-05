import React, { useState } from "react";
import Head from "next/head";
import ServiceBalances from "components/service/ServiceBalances/ServiceBalances";
import { PRODUCT_NAME } from "../utils/constants";
import MainLayout from "../components/MainLayout";
import { useIntl } from "react-intl";
import ServiceLayout from "../components/service/ServiceLayout";
import { Tabs, Tab, TabPanel } from "zignaly-ui";

const Balances = () => {
  const intl = useIntl();
  const [value, setValue] = useState(0);
  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  return (
    <MainLayout>
      <ServiceLayout>
        <Head>
          <title>{`${intl.formatMessage({ id: "service.balances" })} | ${PRODUCT_NAME}`}</title>
        </Head>
        <Tabs onChange={handleChange} value={value}>
          <Tab label={intl.formatMessage({ id: "service.myBalances" })} />
        </Tabs>
        <TabPanel index={0} value={value}>
          <ServiceBalances />
        </TabPanel>
      </ServiceLayout>
    </MainLayout>
  );
};

export default Balances;
