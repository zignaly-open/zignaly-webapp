import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { navigate } from "@reach/router";

const DashboardPage = () => {
  const redirect = () => {
    navigate("/dashboard/positions", { replace: true });
  };

  useEffect(redirect, []);

  return (
    <Helmet>
      <title>Zignaly</title>
    </Helmet>
  );
};

export default DashboardPage;
