import React from "react";
import "./positionsReport.scss";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";

/**
 * @typedef {Object} PositionPageProps
 * @property {string} token Token aquired by the recover request.
 */

/**
 * Positions Report page component.
 *
 * @returns {JSX.Element} Positions Report element.
 */
const PositionsReport = () => {
  const intl = useIntl();

  return (
    <>
      <Helmet>
        <title>
          {`${intl.formatMessage({ id: "recover.title" })} | ${intl.formatMessage({
            id: "product",
          })}`}
        </title>
      </Helmet>
    </>
  );
};

export default PositionsReport;
