import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import useStoreSessionSelector from "../src/hooks/useStoreSessionSelector";
import { useAPIFetch } from "lib/useAPI";
import { isSessionValid, useSession } from "lib/session";
import { cache, keys, setItemCache } from "lib/cacheAPI";

// let sessionDataLocal;
// if (typeof window !== "undefined") {
//   const data = localStorage.getItem(keys.session);
//   sessionDataLocal = JSON.parse(data);
//   // if (data) {
//   //   mutate(`${process.env.NEXT_PUBLIC_TRADEAPI_URL}/user/session`, JSON.parse(data), false);
//   // }
// }

function Auth({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(true);
  const storeSession = useStoreSessionSelector();
  const token = storeSession.tradeApi.accessToken;
  const initialSessionData = cache.get(keys.session);
  const sessionValid = token && isSessionValid(initialSessionData);
  const { endSession } = useSession();

  useAPIFetch<GetSessionRes>(token ? "/user/session" : null, {
    refreshInterval: 60 * 5 * 1000,
    onSuccess(data) {
      // localStorage.setItem(keys.session, JSON.stringify(data));
      setItemCache(keys.session, data);
    },
  });
  const isPublic =
    router.pathname === "/" ||
    router.pathname.match(/^\/login|\/signup|\/recover|\/disable2fa|\/changeEmail|\/deleteAccount/);
  const firstCheck = useRef(true);

  useEffect(() => {
    if (!isPublic) {
      // Private page
      if (firstCheck.current && !sessionValid) {
        // Direct access a private page with an expired session. Don't render until we are redirected to login.
        setAuthorized(false);
        endSession(true);
      }
    } else {
      // Public page
      setAuthorized(true);

      if (firstCheck.current && sessionValid) {
        // Direct access to login page with an active session. Redirect to dashboard.
        router.push({
          pathname: "/service",
        });
      } else if (!sessionValid && router.pathname === "/") {
        // Redirect / to login
        router.push({
          pathname: "/login",
        });
      }
    }

    firstCheck.current = false;
  }, [isPublic]);

  return authorized && children;
}

export default Auth;
