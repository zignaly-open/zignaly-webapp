import React from "react";
import { GlobalStyles } from "@mui/material";

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
  return (
    <>
      {inputGlobalStyles}
      {children}
    </>
  );
}
