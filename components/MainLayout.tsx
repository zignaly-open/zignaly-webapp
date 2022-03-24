import React from "react";
import { createGlobalStyle } from "styled-components";

export default function MainLayout({ children }) {
  const GlobalStyle = createGlobalStyle`
    ${({ theme }) => `
      body {
        background: url(${theme.background.image.src}) no-repeat center center fixed;
        background-size: cover;
      }
    `}
  `;

  return (
    <>
      <GlobalStyle />
      {/* <style jsx global>
        This is global :)
      </style> */}
      {children}
    </>
  );
}
