import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { navigate } from "gatsby";
import useStoreSessionSelector from "../hooks/useStoreSessionSelector";
import { verifySessionData } from "../utils/auth";

const IndexPage = () => {
  const storeSession = useStoreSessionSelector();

  const handleRedirect = () => {
    if (verifySessionData(storeSession.tradeApi.accessToken, storeSession.sessionData)) {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  };

  useEffect(handleRedirect, []);

  return (
    <Helmet>
      <title>Zignaly</title>
    </Helmet>
  );
};

export default IndexPage;
