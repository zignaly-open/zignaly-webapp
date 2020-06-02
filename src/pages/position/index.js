import React from "react";
import { Box } from "@material-ui/core";
import { compose } from "recompose";
import withDashboardLayout from "../../layouts/dashboardLayout";
import { Helmet } from "react-helmet";

/**
 * @typedef {Object} PositionPageProps
 * @property {string} positionId The position ID dynamic route path parameter.
 */

/**
 * Position detail page component.
 *
 * @param {PositionPageProps} props Component properties.
 * @returns {JSX.Element} Position page element.
 */
const PositionPage = (props) => {
  const { positionId } = props;

  return (
    <>
      <Helmet>
        <title>Position Detail</title>
      </Helmet>
      <Box className="positionPage" display="flex" flexDirection="column" justifyContent="center">
        <h1>I will be the position detail page.</h1>
        <Box
          className="positionDetail"
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <h2>Viewing position: {positionId}</h2>
        </Box>
      </Box>
    </>
  );
};

export default compose(withDashboardLayout)(PositionPage);
