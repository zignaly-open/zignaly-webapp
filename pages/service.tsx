import Head from "next/head";
import ServiceDashboard from "../components/Service/ServiceDashboard/ServiceDashboard";
import { PRODUCT_NAME } from "../lib/constants";
import MainLayout from "../components/MainLayout";
import { useIntl } from "react-intl";
import ServiceLayout from "../components/Service/ServiceLayout";

type Props = {};

const Index = ({}: Props) => {
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

export async function getServerSideProps(context) {
  console.log("s");
  return {
    props: {}, // will be passed to the page component as props
  };
}

export default Index;

// export const getStaticProps = async () => {
//   const allPosts = getAllPosts(["title", "date", "slug", "author", "coverImage", "excerpt"]);

//   return {
//     props: { allPosts },
//   };
// };
