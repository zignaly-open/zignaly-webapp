import React from "react";
import { GlobalStyles } from "@mui/material";
import { Container } from "@mui/material";
import Header from "./Header/Header";
import useUser from "lib/useUser";

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

export default function MainLayout({ children }) {
  // Wait until we have the user data before rendering (localstorage)
  const { user } = useUser();

  return (
    <>
      {inputGlobalStyles}
      <Header />
      <Container maxWidth="lg">{user && children}</Container>
    </>
  );
}
