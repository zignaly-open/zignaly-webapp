import React, { useState } from "react";
import Head from "next/head";
import ServiceBalances from "components/service/ServiceBalances/ServiceBalances";
import { PRODUCT_NAME } from "../lib/constants";
import MainLayout from "../components/MainLayout";
import { useIntl } from "react-intl";
import ServiceLayout from "../components/service/ServiceLayout";
import { Tabs, Tab, TabPanel } from "zignaly-ui";

type Props = {};

const Balances = ({}: Props) => {
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
        <Tabs value={value} onChange={handleChange}>
          <Tab label={intl.formatMessage({ id: "service.myBalances" })} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <ServiceBalances />
        </TabPanel>
      </ServiceLayout>
    </MainLayout>
  );
};

export default Balances;
