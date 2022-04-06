import { Container } from "@mui/material";
import Head from "next/head";
import { PRODUCT_NAME } from "../lib/constants";
import MainLayout from "../components/MainLayout";
import { useIntl } from "react-intl";
import ServiceInvestors from "../components/ServiceInvestors/ServiceInvestors";

type Props = {};

const Investors = ({}: Props) => {
  const intl = useIntl();
  return (
    <MainLayout>
      <Container maxWidth="lg">
        <Head>
          <title>{`${intl.formatMessage({ id: "service.investors" })} | ${PRODUCT_NAME}`}</title>
        </Head>
        <ServiceInvestors />
      </Container>
    </MainLayout>
  );
};

export async function getServerSideProps(context) {
  console.log(context);
  return {
    props: {}, // will be passed to the page component as props
  };
}

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
