import { useEffect } from "react";
import { verifySessionData } from "../lib/auth";
import useStoreSessionSelector from "../src/hooks/useStoreSessionSelector";
import useRedirection from "../lib/useRedirection";
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
  const storeSession = useStoreSessionSelector();
  const token = storeSession.tradeApi.accessToken;
  const { redirectDashboard } = useRedirection();

  useEffect(() => {
    const sessionValid = verifySessionData(token, storeSession.sessionData);
    if (sessionValid) {
      redirectDashboard();
      console.log("session already valid, redirecting");
    }
  }, []);

  return <Login />;
};

export default Index;

// export const getStaticProps = async () => {
//   const allPosts = getAllPosts(["title", "date", "slug", "author", "coverImage", "excerpt"]);

//   return {
//     props: { allPosts },
//   };
// };
