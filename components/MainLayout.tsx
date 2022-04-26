import React from "react";
import { GlobalStyles } from "@mui/material";
import Header from "./Header/Header";
import useUser from "lib/useUser";
import Head from "next/head";
import styled from "styled-components";
import SuperModal from "components/Modals/SuperModal";

const inputGlobalStyles = (
  <GlobalStyles
    styles={(theme) => ({
      body: {
        background: `url(${theme.background.image.src}) no-repeat center center fixed`,
        backgroundSize: "cover",
      },
    })}
  />
);

const Container = styled.div`
  max-width: 1200px;
  padding: 0 16px;
  margin: 0 auto;
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
