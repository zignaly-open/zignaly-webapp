import React, { useState } from "react";
import "./StopCopyingTraderForm.scss";
import { Box, Typography, CircularProgress } from "@material-ui/core";
import ReactCodeInput from "react-verification-code-input";
import { useDispatch } from "react-redux";
import tradeApi from "../../../services/tradeApiClient";
import { showErrorAlert } from "../../../store/actions/ui";

/**
 * @typedef {import('react').ChangeEvent} ChangeEvent
 * @typedef {import('react').KeyboardEvent} KeyboardEvent
 * @typedef {import('../../../services/tradeApiClient.types').DefaultProviderGetObject} DefaultProviderGetObject
 */

/**
 * @typedef {Object} DefaultProps
 * @property {Function} onClose
 * @property {DefaultProviderGetObject} provider
 */

/**
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} JSx component.
 */
const StopCopyingTraderForm = ({ onClose, provider }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  return (
    <Box
      alignItems="center"
      className="twoFAForm"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      {loading && <CircularProgress color="primary" size={40} />}
      {!loading && (
        <>
          <Typography variant="h3">2 Factor Authentication</Typography>
          <Box
            alignItems="center"
            className="inputBox"
            display="flex"
            flexDirection="column"
            justifyContent="start"
          >
            <label className="customLabel">
              <Typography>Input Your Authentication Code</Typography>
            </label>
            {/* @ts-ignore */}
            <ReactCodeInput className="code-input" fields={6} onComplete={submitCode} />
          </Box>
        </>
      )}
    </Box>
  );
};

export default StopCopyingTraderForm;
