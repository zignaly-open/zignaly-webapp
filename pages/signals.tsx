import React from "react";
import Head from "next/head";
import { PRODUCT_NAME } from "../lib/constants";
import MainLayout from "../components/MainLayout";
import { useIntl } from "react-intl";
import ServiceSignals from "components/Service/ServiceSignals/ServiceSignals";
import ServiceLayout from "../components/Service/ServiceLayout";

const Investors = () => {
  const intl = useIntl();
  return (
    <MainLayout>
      <ServiceLayout>
        <Head>
          <title>{`${intl.formatMessage({ id: "signals.menu" })} | ${PRODUCT_NAME}`}</title>
        </Head>
        <ServiceSignals />
      </ServiceLayout>
    </MainLayout>
  );
};

export default Investors;
