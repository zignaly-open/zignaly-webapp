import React, { useState } from "react";
import "./StopCopyingTraderForm.scss";
import { Box, Tooltip, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import CustomButton from "../../CustomButton";
import { Help } from "@material-ui/icons";

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
      <Typography variant="h3">
        <FormattedMessage id="confirm.copyt.unfollow.title" />
      </Typography>

      <Typography variant="body1">
        <FormattedMessage id="confirm.copyt.unfollow.message" />
      </Typography>

      {provider.profitSharing && (
        <Box className="labeledInputsBox">
          <span
            className={disconnectMode === 1 ? "checked" : ""}
            onClick={() => handleShareingModeChange(1)}
          >
            <FormattedMessage id="trader.softdisconnect" />
            <Tooltip
              placement="top"
              title={<FormattedMessage id="trader.softdisconnect.tooltip" />}
            >
              <Help className="helpIcon" />
            </Tooltip>
          </span>
          <span
            className={disconnectMode === 2 ? "checked" : ""}
            onClick={() => handleShareingModeChange(2)}
          >
            <FormattedMessage id="trader.harddisconnect" />
            <Tooltip
              placement="top"
              title={<FormattedMessage id="trader.harddisconnect.tooltip" />}
            >
              <Help className="helpIcon" />
            </Tooltip>
          </span>
        </Box>
      )}

      <Box className="formAction" display="flex" flexDirection="row" justifyContent="flex-end">
        <CustomButton className="textDefault" onClick={handleClose}>
          <FormattedMessage id="confirm.cancel" />
        </CustomButton>

        <CustomButton className="textDefault" onClick={handleSuccess}>
          <FormattedMessage id="confirm.accept" />
        </CustomButton>
      </Box>
    </Box>
  );
};

export default StopCopyingTraderForm;
