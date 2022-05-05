import React from "react";
import Head from "next/head";
import ServiceDashboard from "../components/service/dashboard/ServiceDashboard";
import { PRODUCT_NAME } from "../utils/constants";
import MainLayout from "../components/MainLayout";
import { useIntl } from "react-intl";
import ServiceLayout from "../components/service/ServiceLayout";

const Index = () => {
  const intl = useIntl();
  return (
    <MainLayout>
      <ServiceLayout>
        <Head>
          <title>{`${intl.formatMessage({ id: "service.investors" })} | ${PRODUCT_NAME}`}</title>
        </Head>
        <ServiceDashboard />
      </ServiceLayout>
    </MainLayout>
  );
};

// export async function getServerSideProps(context) {
//   return {
//     props: {}, // will be passed to the page component as props
//   };
// }

export default Index;
