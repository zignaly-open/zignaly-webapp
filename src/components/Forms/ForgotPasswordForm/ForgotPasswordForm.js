import React, { useState } from "react";
import "./ForgotPasswordForm.scss";
import { Box, TextField, Typography } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm } from "react-hook-form";
import tradeApi from "../../../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert, showSuccessAlert } from "../../../store/actions/ui";
import { FormattedMessage } from "react-intl";

const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const { errors, handleSubmit, register } = useForm();
  const dispatch = useDispatch();

  /**
   * @typedef {Object} FormData
   * @property {string} email
   */

  /**
   * Function to submit form.
   *
   * @param {FormData} data Form data.
   * @returns {void}
   */
  const onSubmit = (data) => {
    setLoading(true);
    const payload = {
      email: data.email,
      array: true,
    };
    tradeApi
      .forgotPasswordStep1(payload)
      .then(() => {
        dispatch(
          showSuccessAlert("alert.forgotpassword.step1.title", "alert.forgotpassword.step1.body"),
        );
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /**
   * Handle submit buttton click.
   *
   * @type {React.MouseEventHandler} handleClickSubmit
   * @returns {void}
   */
  const handleSubmitClick = () => {
    handleSubmit(onSubmit);
  };

  return (
    <form method="post" onSubmit={handleSubmit(onSubmit)}>
      <Box
        alignItems="center"
        className="forgotPasswordForm"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Typography variant="h3">Password Recovery Form</Typography>
        <Box
          alignItems="start"
          className="inputBox"
          display="flex"
          flexDirection="column"
          justifyContent="start"
        >
          <label className="customLabel">Enter your email address</label>
          <TextField
            className="customInput"
            error={errors.email}
            fullWidth
            inputRef={register({
              required: true,
              pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/,
            })}
            name="email"
            type="email"
            variant="outlined"
          />
          {errors.email && <span className="errorText">email should be valid</span>}
        </Box>

        <Box className="inputBox">
          <CustomButton
            className={"full submitButton"}
            loading={loading}
            onClick={handleSubmitClick}
            type="submit"
          >
            <FormattedMessage id="action.recover" />
          </CustomButton>
        </Box>
      </Box>
    </form>
  );
};

export default ForgotPasswordForm;
