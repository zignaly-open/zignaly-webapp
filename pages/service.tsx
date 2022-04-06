import { Container } from "@mui/material";
import Head from "next/head";
import ServiceDashboard from "../components/ServiceDashboard/ServiceDashboard";
import { CMS_NAME } from "../lib/constants";
import MainLayout from "../components/MainLayout";

type Props = {};

const Index = ({}: Props) => {
  // const heroPost = allPosts[0];
  // const morePosts = allPosts.slice(1);
  return (
    <MainLayout>
      <Container maxWidth="lg">
        <Head>
          <title>Next.js Blog Example with {CMS_NAME}</title>
        </Head>
        <ServiceDashboard />
      </Container>
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
