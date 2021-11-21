import { useEffect, useRef } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import { navigate } from "gatsby";
import { verifySessionData } from "../utils/auth";
import { globalHistory } from "@reach/router";
import { useDispatch } from "react-redux";
import { endTradeApiSession } from "store/actions/session";
import { useStoreUserData } from "./useStoreUserSelector";

const useRedirectUponSessionValid = (newUserPath = "") => {
  const storeSession = useStoreSessionSelector();
  const storeUserData = useStoreUserData();
  const dispatch = useDispatch();
  const forced = useRef(globalHistory.location.state?.forced);
  const firstCheck = useRef(true);

  useEffect(() => {
    firstCheck.current = false;

    if (forced.current) {
      // Token was marked as expired, clear it here.
      forced.current = false;

      dispatch(endTradeApiSession());
      return;
    }

    // Navigate to return url or dashboard if session is valid, and we got user data
    if (
      storeUserData.userId &&
      verifySessionData(storeSession.tradeApi.accessToken, storeSession.sessionData)
    ) {
      const params = new URLSearchParams(window.location.search);
      let path = newUserPath || "/dashboard";
      if (params.get("ret")) {
        // Redirect to last visited page
        const ret = decodeURIComponent(params.get("ret"));
        // Ensure we are not redirecting to an external domain
        if (ret.indexOf(".") === -1) {
          path = ret;
        }
      }

      const pathPrefix = process.env.GATSBY_BASE_PATH || "";
      const pathWithoutPrefix = path.replace(pathPrefix, "");
      navigate(pathWithoutPrefix);
    } else if (firstCheck.current) {
      // The user navigated directly to the login page with an expired token.
      // We need to clear it to avoid sending it in api calls automatically.
      // Only check once at init, because calling /login can set userData before sessionData.
      dispatch(endTradeApiSession());
    }
  }, [storeSession.sessionData, storeUserData.userId]);
};

export default useRedirectUponSessionValid;
