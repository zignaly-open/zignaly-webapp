import { useEffect, useRef } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import { navigate } from "gatsby";
import { verifySessionData } from "../utils/auth";
import { globalHistory } from "@reach/router";

const useRedirectUponSessionValid = (newUserPath = "") => {
  const storeSession = useStoreSessionSelector();
  const forced = useRef(globalHistory.location.state && globalHistory.location.state.forced);

  useEffect(() => {
    // Don't redirect to private area if we've been forced to redirect already.
    // This happens when the tradeapi client detects the session has expired. It's not possible to
    // clear the auth token there, we should detect it as expired now but there is a small chance
    // that's not the case, at least locally, when switching api server for example.
    if (forced.current) {
      forced.current = false;
      return;
    }

    if (verifySessionData(storeSession.tradeApi.accessToken, storeSession.sessionData)) {
      // Navigate to return url or dashboard
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
    }
  }, [storeSession.sessionData]);
};

export default useRedirectUponSessionValid;
