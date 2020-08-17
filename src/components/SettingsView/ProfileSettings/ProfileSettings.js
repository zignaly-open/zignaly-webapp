import React, { useState } from "react";
import { Box, Typography, OutlinedInput } from "@material-ui/core";
import { useIntl, FormattedMessage } from "react-intl";
import { useStoreUserData } from "../../../hooks/useStoreUserSelector";
import "./ProfileSettings.scss";
import CustomButton from "../../CustomButton";
import { useForm, Controller } from "react-hook-form";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import UploadImage from "../../UploadImage";

const ProfileSettings = () => {
  //   const dispatch = useDispatch();
  const storeUserData = useStoreUserData();
  const { handleSubmit, register, reset, control, errors } = useForm();
  const storeSession = useStoreSessionSelector();
  const [updating, setUpdating] = useState(false);
  const [imageUrl, setImageUrl] = useState(storeUserData.imageUrl);
  const intl = useIntl();

  /**
   * @typedef {Object} FormData
   * @property {string} username
   */

  /**
   * Function to submit form.
   *
   * @param {FormData} data Form data.
   * @returns {void}
   */
  const submitForm = (data) => {
    const { username } = data;
    const payload = {
      token: storeSession.tradeApi.accessToken,
      username,
      imageUrl,
    };

    setUpdating(true);

    tradeApi
      .updateProfileNotifications(payload)
      .then((data) => {
        dispatch(showSuccessAlert("Success", "accounts.settings.saved"));
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <Box
        alignItems="flex-start"
        className="profileSettings"
        display="flex"
        flexDirection="column"
      >
        <label className="inputBox">
          <Typography variant="body1">
            <FormattedMessage id="profile.userid" />
          </Typography>
          <Typography className="userId" variant="body1">
            {storeUserData.userId}
          </Typography>
        </label>
        <label className="inputBox">
          <Typography variant="body1">
            <FormattedMessage id="profile.email" />
          </Typography>
          <Typography className="userId" variant="body1">
            {storeUserData.email}
          </Typography>
        </label>
        <Box className="inputBox" display="flex" flexDirection="column">
          <label>
            <Typography variant="body1">
              <FormattedMessage id="profile.username" />
            </Typography>
          </label>
          <OutlinedInput
            error={!!errors.username}
            className="customInput"
            name="username"
            value={storeUserData.username}
            inputRef={register({
              required: intl.formatMessage({ id: "form.error.username" }),
              minLength: 4,
              pattern: /^([a-zA-Z0-9 ()$_-]+)$/,
            })}
          />
          {errors.username && (
            <span className="errorText">
              <FormattedMessage id="profile.username.error" />
            </span>
          )}
        </Box>
        <Box className="inputBox" display="flex" flexDirection="column">
          <label className="customLabel">
            <FormattedMessage id="profile.photo" />
          </label>
          <UploadImage imageUrl={imageUrl} onChange={(url) => setImageUrl(url)} />
        </Box>

        <CustomButton
          className="bgPurple updateButton"
          disabled={updating}
          loading={updating}
          type="submit"
        >
          <FormattedMessage id="action.update" />
        </CustomButton>
      </Box>
    </form>
  );
};

export default ProfileSettings;
