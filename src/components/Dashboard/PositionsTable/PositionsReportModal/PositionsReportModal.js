import React, { useState } from "react";
import "./PositionsReportModal.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import CustomButton from "../../../CustomButton";

/**
 * @typedef {Object} DefaultProps
 * @property {Function} onClose
 * @property {Function} onSuccess
 */

/**
 * Provides the navigation bar for the dashboard.
 *
 * @param {DefaultProps} props Default props
 * @returns {JSX.Element} Component JSX.
 */
const PositionsReportModal = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleSuccess = () => {
    onSuccess();
    setLoading(true);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Box
      alignItems="flex-start"
      className="positionsReportModal"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Typography variant="h3">
        <FormattedMessage id="srv.edit.cacheinfo.title" />
      </Typography>

      <Typography variant="body1">
        <FormattedMessage id="position.report.message" />
      </Typography>

      <Box
        alignItems="space-between"
        display="flex"
        flexDirection="row"
        justifyContent="flex-end"
        minWidth="100%"
      >
        <CustomButton className="textPurple" onClick={handleClose}>
          <FormattedMessage id="action.cancel" />
        </CustomButton>
        <CustomButton className="textPurple" loading={loading} onClick={handleSuccess}>
          <FormattedMessage id="action.proceed" />
        </CustomButton>
      </Box>
    </Box>
  );
};

export default PositionsReportModal;
