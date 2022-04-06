import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

import { verifySessionData } from "../lib/auth";
import useStoreSessionSelector from "../src/hooks/useStoreSessionSelector";
import { endTradeApiSession } from "../src/store/actions/session";
import { useDispatch } from "react-redux";

function Auth({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const storeSession = useStoreSessionSelector();
  const token = storeSession.tradeApi.accessToken;
  const dispatch = useDispatch();

  const publicPaths = ["/login", "/"];
  const path = router.asPath.split("?")[0];
  const isPublic = publicPaths.includes(path);
  const firstCheck = useRef(true);

  useEffect(() => {
    const sessionValid = verifySessionData(token, storeSession.sessionData);

    if (!isPublic && !sessionValid) {
      // Navigating to a private page with an invalid token
      // Redirect to login unless it's the app has already loaded, which means the redirection is caused by
      // a login. In that case the session should become valid as soon as the session fetch responds.
      if (firstCheck.current) {
        setAuthorized(false);
        dispatch(endTradeApiSession());
        router.push({
          pathname: "/",
          query: { returnUrl: router.asPath },
        });
      }
    } else {
      // The user navigated to a public page or got a valid session
      setAuthorized(true);
    }

    firstCheck.current = false;
  }, [isPublic, storeSession.sessionData]);

  return authorized && children;
}

export default Auth;
