import React, { useState } from "react";
import "./StopCopyingTraderForm.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import CustomButton from "../../CustomButton";

/**
 * @typedef {import('../../../services/tradeApiClient.types').DefaultProviderGetObject} DefaultProviderGetObject
 * @typedef {Object} DefaultProps
 * @property {Function} onClose
 * @property {Function} onSuccess
 * @property {DefaultProviderGetObject} provider
 */

/**
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} JSx component.
 */
const StopCopyingTraderForm = ({ onClose, onSuccess, provider }) => {
  const [disconnectMode, setDisconnectMode] = useState(1);

  /**
   *
   * @param {number} val Change event.
   * @returns {Void} None.
   */
  const handleShareingModeChange = (val) => {
    setDisconnectMode(val);
  };

  const handleClose = () => {
    onClose();
  };

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <Box
      alignItems="flex-start"
      className="stopCopyingForm"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      {provider.profitSharing && (
        <Typography variant="h3">
          <FormattedMessage id="confirm.copyt.unfollow.title2" />
        </Typography>
      )}
      {!provider.profitSharing && (
        <>
          <Typography variant="h3">
            <FormattedMessage id="confirm.copyt.unfollow.title" />
          </Typography>

          <Typography variant="body1">
            <FormattedMessage id="confirm.copyt.unfollow.message" />
          </Typography>
        </>
      )}

      {provider.profitSharing && (
        <Box className="labeledInputsBox" display="flex" flexDirection="column">
          <Box display="flex" flexDirection="row" justifyContent="space-between">
            <span
              className={"button " + (disconnectMode === 1 ? "checked" : "")}
              onClick={() => handleShareingModeChange(1)}
            >
              <FormattedMessage id="trader.softdisconnect" />
            </span>
            <span
              className={"button " + (disconnectMode === 2 ? "checked" : "")}
              onClick={() => handleShareingModeChange(2)}
            >
              <FormattedMessage id="trader.harddisconnect" />
            </span>
          </Box>
          {disconnectMode === 1 && (
            <span className="info">
              <FormattedMessage id="trader.softdisconnect.tooltip" />
            </span>
          )}
          {disconnectMode === 2 && (
            <span className="info">
              <FormattedMessage id="trader.harddisconnect.tooltip" />
            </span>
          )}
        </Box>
      )}

      <Box className="formAction" display="flex" flexDirection="row" justifyContent="flex-end">
        <CustomButton className="textPurple" onClick={handleClose}>
          <FormattedMessage id="confirm.cancel" />
        </CustomButton>

        <CustomButton className="textPurple" onClick={handleSuccess}>
          <FormattedMessage id="confirm.accept" />
        </CustomButton>
      </Box>
    </Box>
  );
};

export default StopCopyingTraderForm;
