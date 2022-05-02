import React from "react";
import Head from "next/head";
import { PRODUCT_NAME } from "../lib/constants";
import MainLayout from "../components/MainLayout";
import { useIntl } from "react-intl";
import ServiceInvestors from "../components/service/ServiceInvestors/ServiceInvestors";
import ServiceLayout from "../components/service/ServiceLayout";

const Investors = () => {
  const intl = useIntl();
  return (
    <MainLayout>
      <ServiceLayout>
        <Head>
          <title>{`${intl.formatMessage({ id: "service.investors" })} | ${PRODUCT_NAME}`}</title>
        </Head>
        <ServiceInvestors />
      </ServiceLayout>
    </MainLayout>
  );
};

// export async function getServerSideProps(context) {
//   return {
//     props: {}, // will be passed to the page component as props
//   };
// }

// export const getServerSideProps = withIronSessionSsr(async function ({
//   req,
//   res,
// }) {
//   const user = req.session.user

//   if (user === undefined) {
//     res.setHeader('location', '/login')
//     res.statusCode = 302
//     res.end()
//     return {
//       props: {
//         user: { isLoggedIn: false, login: '', avatarUrl: '' } as User,
//       },
//     }
//   }

//   return {
//     props: { user: req.session.user },
//   }
// },
export default Investors;
