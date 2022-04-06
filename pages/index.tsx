// import Container from "../components/container";
// import MoreStories from "../components/more-stories";
// import HeroPost from "../components/hero-post";
// import Intro from "../components/intro";
// import Layout from "../components/layout";
// import { getAllPosts } from "../lib/api";
import { Button, Container } from "@mui/material";
import Head from "next/head";
// import type { NextPage } from "next";
import Login from "../src/components/Login/Login";
import LoginTabs from "../src/components/Login/LoginTabs";
import LoginForm from "../src/components/Forms/LoginForm";
import { CMS_NAME } from "../lib/constants";
// import Post from "../types/post";
import { createGlobalStyle } from "styled-components";
import { useEffect } from "react";
import { verifySessionData } from "../lib/auth";
import useStoreSessionSelector from "../src/hooks/useStoreSessionSelector";
import useRedirection from "../lib/useRedirection";

type Props = {
  // allPosts: Post[];
};

// const GlobalStyle = createGlobalStyle`
//   ${({ theme }) => `
//     body {
//       background-color: #fbfafc;
//     }
//   `}
// `;

const Index = ({}: Props) => {
  const storeSession = useStoreSessionSelector();
  const token = storeSession.tradeApi.accessToken;
  const { redirectDashboard } = useRedirection();

  useEffect(() => {
    const sessionValid = verifySessionData(token, storeSession.sessionData);
    if (sessionValid) {
      // move to index page?
      redirectDashboard();
      console.log("session already valid, redirecting");
    }
  }, []);
  return (
    <Container maxWidth="lg">
      {/* <GlobalStyle /> */}
      <Head>
        <title>Next.js Blog Example with {CMS_NAME}</title>
      </Head>
      <Login>
        <LoginTabs>
          <LoginForm />
        </LoginTabs>
      </Login>
    </Container>
  );
};

export default Index;

// export const getStaticProps = async () => {
//   const allPosts = getAllPosts(["title", "date", "slug", "author", "coverImage", "excerpt"]);

//   return {
//     props: { allPosts },
//   };
// };
