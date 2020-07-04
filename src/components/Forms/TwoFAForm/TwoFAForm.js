import React, { useState } from "react";
import "./TwoFAForm.scss";
import { Box, Typography } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import ReactCodeInput from "react-verification-code-input";
import { useForm, Controller } from "react-hook-form";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../../../store/actions/ui";
import { ask2FA } from "../../../store/actions/ui";

/**
 * @typedef {import('react').ChangeEvent} ChangeEvent
 * @typedef {import('react').KeyboardEvent} KeyboardEvent
 */

const TwoFAForm = () => {
  const [, setCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [codeError, setCodeError] = useState(false);
  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();

  const {
    register,
    errors,
    handleSubmit,
    control,
    watch,
    setError,
    clearError,
    formState,
  } = useForm({
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

    tradeApi
      .verify2FA(payload)
      .then((payload) => {
        dispatch(ask2FA(false));
      })
      .catch((e) => {
        if (e.code === 37) {
          //   setError("code", "notMatch", "Wrong code.");
          setCodeError(true);
        } else {
          dispatch(showErrorAlert(e));
        }
        setLoading(false);
      });
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
            control={control}
            as={ReactCodeInput}
            className="codeInput"
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
            error={!!errors.code}
          />
          {/* {errors.code && <span className="errorText">{errors.code.message}</span>} */}
          {codeError && <span className="errorText">Wrong code.</span>}
          <CustomButton
            className="bgPurple"
            loading={loading}
            fullWidth={true}
            disabled={!isValid}
            type="submit"
          >
            Sign in
          </CustomButton>
        </Box>
      </Box>
    </form>
  );
};

export default TwoFAForm;
