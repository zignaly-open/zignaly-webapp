import React, { useState } from "react";
import "./TwoFAForm.scss";
import { Box } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
// import {verify2FA} from 'actions';
import ReactCodeInput from "react-verification-code-input";

/**
 * @typedef {import('react').ChangeEvent} ChangeEvent
 * @typedef {import('react').KeyboardEvent} KeyboardEvent
 */

const TwoFAForm = () => {
  const [, setCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [codeError, setCodeError] = useState(false);

  /**
   * Code change event callback.
   *
   * @param {string} value Code change event.
   * @return {void}
   */
  const handleCodeChange = (value) => {
    setCode(value.length === 6);
    if (value.length === 6) {
      setCodeError(false);
    } else {
      setCodeError(true);
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    // this.props.dispatch(verify2FA(this.props.user.token, this.state.code));
  };

  /**
   * Code submission enter keypress kandling.
   *
   * @param {KeyboardEvent} event Key press event.
   * @returns {void}
   */
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <Box
      alignItems="center"
      className="twoFAForm"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <span className="boxTitle">2 Factor Authentication</span>
      <Box
        alignItems="center"
        className="inputBox"
        display="flex"
        flexDirection="column"
        justifyContent="start"
      >
        <label className="customLabel">Input Your Authentication Code</label>
        <ReactCodeInput fields={6} onChange={handleCodeChange} onComplete={handleKeyPress} />
        {codeError && <span className="errorText">Code must be of 6 digits!</span>}
      </Box>

      <Box className="inputBox" display="flex" flexDirection="row" justifyContent="center">
        <CustomButton className={"fullSubmitButton"} loading={loading} onClick={handleSubmit}>
          Sign in
        </CustomButton>
      </Box>
    </Box>
  );
};

export default TwoFAForm;
