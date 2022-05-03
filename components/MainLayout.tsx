import React from "react";
import { GlobalStyles } from "@mui/material";
import useUser from "lib/useUser";
import Head from "next/head";
import styled from "styled-components";

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
  padding: 0 8px;
  margin: 0 auto;
`;

export default function MainLayout({ children }) {
  // Wait until we have the user data before rendering (localstorage)
  const { user } = useUser();

  return (
    <>
      <Head>
        {/* Preload fonts */}
        <link
          as="font"
          crossOrigin=""
          href={`${process.env.NEXT_PUBLIC_BASE_PATH}/fonts/AvenirNext/AvenirNextLTPro-Regular.otf`}
          rel="preload"
        />
      </Head>
      {inputGlobalStyles}
      <Container>{user && children}</Container>
    </>
  );
}
