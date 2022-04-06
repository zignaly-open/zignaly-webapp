import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// import { userService } from "services";
import { verifySessionData } from "../lib/auth";
import useStoreSessionSelector from "../src/hooks/useStoreSessionSelector";
import { endTradeApiSession } from "../src/store/actions/session";
import { useDispatch } from "react-redux";
import useRedirection from "../lib/useRedirection";

export { RouteGuard };

function RouteGuard({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const storeSession = useStoreSessionSelector();
  const token = storeSession.tradeApi.accessToken;
  const dispatch = useDispatch();
  const { redirectDashboard } = useRedirection();

  useEffect(() => {
    // on initial load - run auth check
    authCheck(router.asPath);

    // on route change start - hide page content by setting authorized to false
    const hideContent = () => setAuthorized(false);
    router.events.on("routeChangeStart", hideContent);

    // on route change complete - run auth check
    router.events.on("routeChangeComplete", authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off("routeChangeStart", hideContent);
      router.events.off("routeChangeComplete", authCheck);
    };
  }, []);

  const authCheck = (url) => {
    // redirect to login page if accessing a private page and not logged in
    const publicPaths = ["/login", "/", "/investors", "/service"];
    const path = url.split("?")[0];

    const sessionValid = verifySessionData(token, storeSession.sessionData);
    console.log("sessionValid", sessionValid, path);

    if (!sessionValid && !publicPaths.includes(path)) {
      setAuthorized(false);
      dispatch(endTradeApiSession());
      router.push({
        pathname: "/",
        query: { returnUrl: router.asPath },
      });
    } else {
      if (path === "/" && sessionValid) {
        redirectDashboard();
        console.log("session already valid, redirecting");
      } else {
        setAuthorized(true);
      }
    }
  };

  return authorized && children;
}
