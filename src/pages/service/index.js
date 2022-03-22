import ServiceDashboard from "components/ServiceDashboard/ServiceDashboard";
import React from "react";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";

const Service = () => {
  const intl = useIntl();

  return (
    <>
      <Helmet>
        <title>
          {`${intl.formatMessage({
            id: "dashboard",
          })} - ${intl.formatMessage({
            id: "dashboard.positions",
          })} | ${intl.formatMessage({ id: "product" })}`}
        </title>
      </Helmet>
      <ServiceDashboard />
    </>
  );
};

export default Service;
