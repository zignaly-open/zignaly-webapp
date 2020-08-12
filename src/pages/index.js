import React from "react";
import { Helmet } from "react-helmet";
import { navigate } from "gatsby";
import useStoreSessionSelector from "../hooks/useStoreSessionSelector";
import { verifySessionData } from "../utils/auth";

const IndexPage = () => {
  const storeSession = useStoreSessionSelector();

  if (verifySessionData(storeSession.tradeApi.accessToken, storeSession.sessionData)) {
    navigate("/dashboard/positions", { replace: true });
  } else {
    navigate("/login", { replace: true });
  }

  return (
    <Helmet>
      <title>Zignaly</title>
    </Helmet>
  );
};

export default IndexPage;
