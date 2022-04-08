import React, { useEffect } from "react";
import { GlobalStyles } from "@mui/material";
import { useDispatch } from "react-redux";
import {
  endTradeApiSession,
  refreshSessionData,
  setSessionData,
} from "../src/store/actions/session";
import useInterval from "../src/hooks/useInterval";
import useAPI from "../lib/useAPI";
import { Container } from "@mui/material";
import Header from "./Header/Header";

// const GlobalStyle = createGlobalStyle`
//     ${({ theme }) => `
//       body {
//         background: url(${theme.background.image.src}) no-repeat center center fixed;
//         background-size: cover;
//       }
//     `}
//   `;
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
  // const { getSession } = useAPI();
  // const dispatch = useDispatch();
  // const updateSession = async () => {
  //   const res = await getSession();
  //   dispatch(setSessionData(res));
  // };
  // useInterval(updateSession, 60 * 1000, true);

  return (
    <>
      {inputGlobalStyles}
      <Header />
      <Container maxWidth="lg">{children}</Container>
    </>
  );
}
