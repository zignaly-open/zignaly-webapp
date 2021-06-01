import React, { useEffect } from "react";
import "./positionReport.scss";
import { Helmet } from "react-helmet";
import { FormattedMessage, useIntl } from "react-intl";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import tradeApi from "../../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "store/actions/ui";

/**
 * @typedef {Object} PositionPageProps
 * @property {string} token Token aquired by the recover request.
 */

/**
 * Positions Report page component.
 * @param {PositionPageProps} props Component properties.
 * @returns {JSX.Element} Positions Report element.
 */
const PositionReport = ({ token }) => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const downloadFile = () => {
    if (token) {
      tradeApi
        .downloadReport({ token })
        .then(() => {})
        .catch((e) => {
          dispatch(showErrorAlert(e));
        });
    }
  };

  useEffect(downloadFile, [token]);

  return (
    <>
      <Helmet>
        <title>
          {`${intl.formatMessage({ id: "position.report.title" })} | ${intl.formatMessage({
            id: "product",
          })}`}
        </title>
      </Helmet>
      <Box
        alignItems="center"
        className="positionReportPage"
        display="flex"
        flexDirection="row"
        justifyContent="center"
      >
        <Box
          alignItems="center"
          className="reportBox"
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <CircularProgress color="primary" size={50} />
          <Typography variant="h3">
            <FormattedMessage id="position.report.download.message" />
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default PositionReport;
