import React, { useState } from "react";
import "./TwoFAForm.scss";
import { Box, Typography } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import ReactCodeInput from "react-verification-code-input";
import { useForm, Controller } from "react-hook-form";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { authenticate2FA } from "../../../store/actions/session";

/**
 * @typedef {import('react').ChangeEvent} ChangeEvent
 * @typedef {import('react').KeyboardEvent} KeyboardEvent
 */

const TwoFAForm = () => {
  const [loading, setLoading] = useState(false);
  const [codeError, setCodeError] = useState(false);
  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();

  const { errors, handleSubmit, control, formState } = useForm({
    mode: "onChange",
  });

  const { isValid } = formState;

  /**
   * @typedef {Object} FormData
   * @property {string} code
   */

  /**
   * Function to submit form.
   *
   * @param {FormData} data Form data.
   * @returns {void}
   */
  const submitCode = (data) => {
    setLoading(true);
    const payload = {
      code: data.code,
      token: storeSession.tradeApi.accessToken,
    };
    dispatch(authenticate2FA(payload, setLoading));
  };

  return (
    <form onSubmit={handleSubmit(submitCode)}>
      <Box
        alignItems="center"
        className="twoFAForm"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
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
          <Controller
            // @ts-ignore
            as={ReactCodeInput}
            className="codeInput"
            control={control}
            error={!!errors.code}
            fields={6}
            name="code"
            onChange={(val) => {
              setCodeError(false);
              return val[0];
            }}
            rules={{
              required: true,
              minLength: 6,
            }}
          />
          {/* {errors.code && <span className="errorText">{errors.code.message}</span>} */}
          {codeError && <span className="errorText">Wrong code.</span>}
          <CustomButton
            className="bgPurple"
            disabled={!isValid}
            fullWidth={true}
            loading={loading}
            type="submit"
          >
            Authenticate
          </CustomButton>
        </Box>
      </Box>
    </form>
  );
};

export default TwoFAForm;
