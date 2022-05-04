import React from "react";
import { GlobalStyles } from "@mui/material";
import Header from "./common/Header/Header";
import useUser from "lib/hooks/useUser";
import Head from "next/head";
import styled from "styled-components";
import SuperModal from "components/modals/SuperModal";

const inputGlobalStyles = (
  <GlobalStyles
    styles={(theme) => ({
      body: {
        backgroundImage: `url(${theme.background.image})`,
        backgroundColor: "#101225",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "scroll",
        backgroundPosition: "top center",
        backgroundSize: "cover",
      },
      svg: {
        fill: "currentcolor",
      },
      a: {
        color: theme.links,
        textDecorationLine: "none",
      },
      h1: {
        // todo: remove important once Typography selector has less specificity
        color: `${theme.neutral100} !important`,
      },
    })}
  />
);

const Container = styled.div`
  max-width: 1200px;
  padding: 0 8px;
  margin: 0 auto 60px;
`;

export default function MainLayout({ children }) {
  // Wait until we have the user data before rendering (pre loaded from localstorage)
  const { user } = useUser();

  return (
    <>
      <Head>
        {/* Preload fonts */}
        <link
          rel="preload"
          href={`${process.env.NEXT_PUBLIC_BASE_PATH}/fonts/AvenirNext/AvenirNextLTPro-Regular.otf`}
          as="font"
          crossOrigin=""
        />
      </Head>
      {inputGlobalStyles}
      <Header />
      <SuperModal />
      <Container>{user && children}</Container>
    </>
  );
}
