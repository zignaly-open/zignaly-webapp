import React from "react";
import Login from "./login";

// const GlobalStyle = createGlobalStyle`
//   ${({ theme }) => `
//     body {
//       background-color: #fbfafc;
//     }
//   `}
// `;

const Index = () => {
  return <Login />;
};

export default Index;

// export const getStaticProps = async () => {
//   const allPosts = getAllPosts(["title", "date", "slug", "author", "coverImage", "excerpt"]);

//   return {
//     props: { allPosts },
//   };
// };
