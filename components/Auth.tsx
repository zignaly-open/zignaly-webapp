import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { verifySessionData } from "lib/auth";
import useStoreSessionSelector from "../src/hooks/useStoreSessionSelector";
import { endTradeApiSession, setSessionData } from "../src/store/actions/session";
import { useDispatch } from "react-redux";
import { useAPIFetch } from "lib/useAPI";

const isValid = (sessionData) => sessionData.validUntil * 1000 > new Date().getTime();

function Auth({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const storeSession = useStoreSessionSelector();
  const token = storeSession.tradeApi.accessToken;
  const dispatch = useDispatch();
  const sessionValid = token && isValid(storeSession.sessionData);
  const { data: sessionData } = useAPIFetch<GetSessionRes>(sessionValid ? "/user/session" : null, {
    refreshInterval: 60000,
    // revalidateOnFocus: false,
  });
  const publicPaths = ["/login", "/"];
  const path = router.asPath.split("?")[0];
  const isPublic = publicPaths.includes(path);
  const firstCheck = useRef(true);

  useEffect(() => {
    if (sessionData) {
      // Store locally so we know if the session is expired when the user refreshes the page.
      dispatch(setSessionData(sessionData));
    }
  }, [sessionData]);

  useEffect(() => {
    if (!isPublic && !sessionValid) {
      // Only check for session validity during the app load. After that, isPublic will only be modified
      // by a successful login. So instead of waiting for getSession to return and then check again here, continue.
      if (firstCheck.current) {
        setAuthorized(false);
        dispatch(endTradeApiSession());
        router.push({
          pathname: "/login",
          query: { returnUrl: router.asPath },
        });
      }
    } else {
      // The user navigated to a public page or got a valid session
      setAuthorized(true);
    }

    firstCheck.current = false;
  }, [isPublic]);

  return authorized && children;
}

export default Auth;
