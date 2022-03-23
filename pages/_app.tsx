// import '../styles/globals.css'
import React, { useMemo } from "react";
// import {  } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import type { AppProps } from "next/app";
import { createGlobalStyle } from "styled-components";
import getTheme from "./theme";
const darkTheme = "dark";

const GlobalStyle = createGlobalStyle`
  ${({ theme }) => `
    body {
      background-image: url(${theme.background.image});
      background-repeat: no-repeat;
    }
  `}
`;

function MyApp({ Component, pageProps }: AppProps) {
  const theme = useMemo(() => createTheme(getTheme(darkTheme)), [darkTheme]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
