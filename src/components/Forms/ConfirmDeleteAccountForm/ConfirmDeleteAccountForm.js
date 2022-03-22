import React, { useState } from "react";
import "./ConfirmDeleteAccountForm.scss";
import { Box, OutlinedInput, Typography } from "@mui/material";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm } from "react-hook-form";
import tradeApi from "../../../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showSuccessAlert, showErrorAlert } from "../../../store/actions/ui";
import { navigate } from "gatsby";
import { FormattedMessage, useIntl } from "react-intl";

/**
 * @typedef {Object} PositionPageProps
 * @property {string} code code aquired by the recover request.
 * @property {React.SetStateAction<*>} setExpired
 */

/**
 * Reset 2FA form component.
 *
 * @param {PositionPageProps} props Component properties.
 * @returns {JSX.Element} Reset Password element.
 */
const ConfirmDeleteAccountForm = ({ code, setExpired }) => {
  const [loading, setLoading] = useState(false);
  const { handleSubmit, register } = useForm();
  const dispatch = useDispatch();
  const intl = useIntl();

  /**
   * @typedef {Object} DataObject
   * @property {String} reason
   */

  /**
   * Data returned at form submition.
   *
   * @param {DataObject} data form data received by the submit method.
   * @returns {void}
   */
  const onSubmit = (data) => {
    const { reason } = data;
    setLoading(true);
    const payload = {
      token: code,
      reason,
    };
    tradeApi
      .deleteAccountConfirm(payload)
      .then(() => {
        dispatch(showSuccessAlert("", "deleteaccount.success"));
        navigate("/login");
      })
      .catch((e) => {
        if (e.code === 48) {
          setExpired(false);
        } else {
          dispatch(showErrorAlert(e));
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form method="post" onSubmit={handleSubmit(onSubmit)}>
      <Box
        alignItems="center"
        className="confirmDeleteAccountForm"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Typography variant="h3">
          <FormattedMessage id="deleteaccount.title" />
        </Typography>
        <Typography>
          <FormattedMessage id="deleteaccount.confirm" />
        </Typography>
        <OutlinedInput
          className="customInput"
          fullWidth={true}
          inputRef={register}
          name="reason"
          placeholder={intl.formatMessage({ id: "deleteaccount.reason" })}
        />
        <CustomButton className="submitButton" loading={loading} type="submit">
          <FormattedMessage id="deleteaccount.title" />
        </CustomButton>
      </Box>
    </form>
  );
};

export default ConfirmDeleteAccountForm;
