import { useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import { navigate } from "gatsby";
import { verifySessionData } from "../utils/auth";

const useRedirectUponSessionValid = () => {
  const storeSession = useStoreSessionSelector();

  useEffect(() => {
    if (verifySessionData(storeSession.tradeApi.accessToken, storeSession.sessionData)) {
      // Navigate to return url or dashboard
      const params = new URLSearchParams(
        typeof window !== "undefined" ? window.location.search : "",
      );
      const path = params.get("ret") || "/dashboard";
      const pathPrefix = process.env.GATSBY_BASE_PATH || "";
      const pathWithoutPrefix = path.replace(pathPrefix, "");
      navigate(pathWithoutPrefix);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeSession.sessionData]);
};

export default useRedirectUponSessionValid;
