import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import useStoreSessionSelector from "../src/hooks/useStoreSessionSelector";
// import { endTradeApiSession, setSessionData } from "../src/store/actions/session";
import { useDispatch } from "react-redux";
import { useAPIFetch } from "lib/useAPI";
// import { mutate } from "swr";
import { isSessionValid, useSession } from "lib/session";
import { keys } from "lib/cache";

let sessionDataLocal;
if (typeof window !== "undefined") {
  const data = localStorage.getItem(keys.session);
  sessionDataLocal = JSON.parse(data);
  // if (data) {
  //   mutate(`${process.env.NEXT_PUBLIC_TRADEAPI_URL}/user/session`, JSON.parse(data), false);
  // }
}

function Auth({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(true);
  const storeSession = useStoreSessionSelector();
  const token = storeSession.tradeApi.accessToken;
  const dispatch = useDispatch();
  const sessionValid = token && isSessionValid(sessionDataLocal);
  const { endSession } = useSession();
  console.log(sessionValid, token, sessionDataLocal, new Date().getTime());

  useAPIFetch<GetSessionRes>(token ? "/user/session" : null, {
    refreshInterval: 60000,
    // revalidateOnFocus: false,
    onSuccess(data) {
      localStorage.setItem(keys.session, JSON.stringify(data));
      console.log("updated");
    },
  });
  const publicPaths = ["/login", "/"];
  const path = router.asPath.split(/#?/)[0];
  const pathWithoutTrailingSlash = path === "/" ? path : path.replace(/\/$/, "");
  const isPublic = publicPaths.includes(pathWithoutTrailingSlash);
  const firstCheck = useRef(true);

  // useEffect(() => {
  //   if (sessionData) {
  //     // Store locally so we know if the session is expired when the user refreshes the page.
  //     dispatch(setSessionData(sessionData));
  //   }
  // }, [sessionData]);

  useEffect(() => {
    if (!isPublic) {
      // Only check for session validity during the app load. After that, isPublic will only be modified
      // by a successful login. So instead of waiting for getSession to return and then check again here, continue.
      if (firstCheck.current) {
        if (sessionValid) {
          // setAuthorized(true);
        } else {
          // Direct access a private page with an expired session. Don't render until we are redirected.
          setAuthorized(false);
          // dispatch(endTradeApiSession());
          endSession();
        }
      }
    } else {
      // The user navigated to a public page or got a valid session
      setAuthorized(true);

      console.log("imp", firstCheck.current, firstCheck.current && sessionValid);
      if (firstCheck.current && sessionValid) {
        // Direct access to login page with an active session
        router.push({
          pathname: "/service",
        });
        console.log("session already valid, redirecting");
        // router.push({
        //   pathname: "/login",
        //   query: { returnUrl: router.asPath },
        // });
      }
    }

    firstCheck.current = false;
  }, [isPublic]);

  return authorized && children;
}

export default Auth;
