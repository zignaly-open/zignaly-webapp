import React, { useState } from "react";
import "./MarketplaceCacheMessage.scss";
import { Box, Typography, Checkbox } from "@material-ui/core";
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
const MarketplaceCacheMessage = ({ onClose, onSuccess }) => {
  const [showaAgain, setShowAgain] = useState(true);

  const handleSuccess = () => {
    onSuccess(showaAgain);
    onClose();
  };

  /**
   * Change handler.
   *
   * @param {React.ChangeEvent} e Change event.
   * @returns {Void} None.
   */
  const handleChange = (e) => {
    /* @ts-ignore */
    setShowAgain(e.target.checked);
  };

  return (
    <Box
      alignItems="flex-start"
      className="marketplaceCacheMessageBox"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Typography variant="h3">
        <FormattedMessage id="srv.edit.cacheinfo.title" />
      </Typography>

      <Typography variant="body1">
        <FormattedMessage id="srv.edit.cacheinfo.message" />
      </Typography>

      <Box
        alignItems="space-between"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        minWidth="100%"
      >
        <Box alignItems="center" display="flex" flexDirection="row">
          <Checkbox
            checked={showaAgain}
            inputProps={{ "aria-label": "primary checkbox" }}
            onChange={handleChange}
          />
          <FormattedMessage id="srv.edit.cacheinfo.dont" />
        </Box>
        <CustomButton className="textPurple" onClick={handleSuccess}>
          <FormattedMessage id="action.accept" />
        </CustomButton>
      </Box>
    </Box>
  );
};

export default MarketplaceCacheMessage;
