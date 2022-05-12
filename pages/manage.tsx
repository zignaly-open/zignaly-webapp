import React from "react";
import Head from "next/head";
import { PRODUCT_NAME } from "../utils/constants";
import MainLayout from "../components/MainLayout";
import { useIntl } from "react-intl";
import ServiceManagement from "components/service/ServiceManagement/ServiceManagement";
import ServiceLayout from "components/service/ServiceLayout";

const Manage = () => {
  const intl = useIntl();
  return (
    <MainLayout>
      <ServiceLayout>
        <Head>
          <title>{`${intl.formatMessage({ id: "signals.menu" })} | ${PRODUCT_NAME}`}</title>
        </Head>
        <ServiceManagement />
      </ServiceLayout>
    </MainLayout>
  );
};

export default Manage;
