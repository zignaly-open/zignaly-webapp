import React, { useState } from "react";
import { Box, Typography, OutlinedInput } from "@material-ui/core";
import { useIntl, FormattedMessage } from "react-intl";
import { useStoreUserData } from "../../../hooks/useStoreUserSelector";
import "./ProfileSettings.scss";
import CustomButton from "../../CustomButton";
import { useForm } from "react-hook-form";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import UploadImage from "../../UploadImage";
import { useDispatch } from "react-redux";
import { showErrorAlert, showSuccessAlert } from "../../../store/actions/ui";
import { getUserData } from "../../../store/actions/user";
import tradeApi from "../../../services/tradeApiClient";
import ProfileIcon from "../../../images/header/profileIcon.svg";
import ChangeEmailButton from "./ChangeEmailButton";

const ProfileSettings = () => {
  const storeUserData = useStoreUserData();
  const { handleSubmit, register, errors } = useForm();
  const storeSession = useStoreSessionSelector();
  const [updating, setUpdating] = useState(false);
  const [imageUrl, setImageUrl] = useState(storeUserData.imageUrl);
  const intl = useIntl();
  const dispatch = useDispatch();

  /**
   * @typedef {Object} FormData
   * @property {string} userName
   */

  /**
   * Function to submit form.
   *
   * @param {FormData} data Form data.
   * @returns {void}
   */
  const submitForm = (data) => {
    const { userName } = data;
    const payload = {
      token: storeSession.tradeApi.accessToken,
      userName,
      imageUrl,
    };

    setUpdating(true);

    tradeApi
      .updateUser(payload)
      .then(() => {
        dispatch(showSuccessAlert("Success", "accounts.settings.saved"));
        dispatch(getUserData(storeSession.tradeApi.accessToken));
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
          <Box alignItems="center" className="emailBox" display="flex">
            <Typography className="userId" variant="body1">
              {storeUserData.email}
            </Typography>
            <ChangeEmailButton />
          </Box>
        </label>
        <Box className="inputBox" display="flex" flexDirection="column">
          <label>
            <Typography variant="body1">
              <FormattedMessage id="profile.username" />
            </Typography>
          </label>
          <OutlinedInput
            className="customInput"
            defaultValue={storeUserData.userName || ""}
            error={!!errors.userName}
            inputRef={register({
              required: intl.formatMessage({ id: "form.error.username" }),
              minLength: 4,
              maxLength: 15,
              pattern: /^([a-zA-Z0-9 ()$_-]+)$/,
            })}
            name="userName"
          />
          {errors.userName && (
            <span className="errorText">
              <FormattedMessage id="form.error.username.format" />
            </span>
          )}
        </Box>
        <Box className="inputBox" display="flex" flexDirection="column">
          <label className="customLabel">
            <FormattedMessage id="profile.photo" />
          </label>
          <UploadImage
            defaultImage={ProfileIcon}
            imageUrl={imageUrl || ""}
            onChange={(url) => setImageUrl(url)}
          />
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
