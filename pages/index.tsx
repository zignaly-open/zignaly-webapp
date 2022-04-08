import Login from "./login";

type Props = {};

// const GlobalStyle = createGlobalStyle`
//   ${({ theme }) => `
//     body {
//       background-color: #fbfafc;
//     }
//   `}
// `;

const Index = ({}: Props) => {
  return <Login />;
};

export default Index;

// export const getStaticProps = async () => {
//   const allPosts = getAllPosts(["title", "date", "slug", "author", "coverImage", "excerpt"]);

//   return {
//     props: { allPosts },
//   };
// };
