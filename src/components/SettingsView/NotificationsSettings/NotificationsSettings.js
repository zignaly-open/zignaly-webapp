import React, { useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  OutlinedInput,
  CircularProgress,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { FormattedMessage } from "react-intl";
import { useDispatch } from "react-redux";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import "./NotificationsSettings.scss";
import tradeApi from "../../../services/tradeApiClient";
import { showErrorAlert, showSuccessAlert } from "../../../store/actions/ui";
import { useForm, Controller } from "react-hook-form";
import CustomButton from "../../CustomButton";

/**
 * @typedef {import('../../../services/tradeApiClient.types').ProfileNotifications} ProfileNotifications
 * @typedef {import('react-hook-form').Control} Control
 */

const NotificationsSettings = () => {
  const dispatch = useDispatch();
  const storeSettings = useStoreSettingsSelector();
  const storeSession = useStoreSessionSelector();
  const { handleSubmit, register, reset, control, errors } = useForm();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [telegramEnabled, enableTelegram] = useState(false);

  const loadData = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
    };

    tradeApi
      .getProfileNotifications(payload)
      .then((data) => {
        setLoading(false);
        console.log(data);
        enableTelegram(data.telegramEnable);
        reset(data);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };
  useEffect(loadData, [storeSession.tradeApi.accessToken]);

  /**
   * Function to submit form.
   *
   * @param {ProfileNotifications} data Form data.
   * @returns {void}
   */
  const submitForm = (data) => {
    console.log(data);
    const payload = {
      token: storeSession.tradeApi.accessToken,
      notifications: {
        ...data,
        emailEnable:
          data.emailNews ||
          data.emailOpenPosition ||
          data.emailUpdatePosition ||
          data.emailSubscriptionWarning,
        telegramEnable: telegramEnabled,
        telegramCode: telegramEnabled ? data.telegramCode : "",
      },
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
        className="notificationsSettings"
        display="flex"
        flexDirection="column"
      >
        {!loading ? (
          <>
            <Typography variant="body1" className="bold">
              <FormattedMessage id="notifications.email" />
            </Typography>
            <FormGroup>
              <NotificationCheckbox
                name="emailNews"
                label="notifications.zignaly"
                control={control}
              />
              <NotificationCheckbox
                name="emailOpenPosition"
                label="notifications.positionopened"
                control={control}
              />
              <NotificationCheckbox
                name="emailUpdatePosition"
                control={control}
                label="notifications.positionupdate"
              />
              <NotificationCheckbox
                name="emailSubscriptionWarning"
                control={control}
                label="notifications.warnings"
              />
              {/* <NotificationCheckbox name="" label="notifications.demo" /> */}
            </FormGroup>
            <Typography variant="body1" className="bold">
              Telegram
            </Typography>
            {telegramEnabled && (
              <Box className="inputBox" display="flex" flexDirection="column">
                <Alert severity="info" className="codeInfo">
                  <FormattedMessage
                    id="notifications.codeinfo"
                    values={{
                      url: <a href="https://t.me/ZignalyBot">https://t.me/ZignalyBot</a>,
                      command: <b>/getCode</b>,
                    }}
                  />
                </Alert>
                <label>
                  <Typography variant="body1" className="customLabel">
                    <FormattedMessage id="notifications.telegramcode" />
                  </Typography>
                  <OutlinedInput
                    name="telegramCode"
                    className="customInput"
                    inputRef={register({ required: "Please enter your telegram code." })}
                  />
                </label>
                {errors.telegramCode && (
                  <span className="errorText">{errors.telegramCode.message}</span>
                )}
              </Box>
            )}
            <CustomButton
              className="borderPurple textPurple bold telegramButton"
              onClick={() => enableTelegram(!telegramEnabled)}
            >
              <FormattedMessage
                id={`notifications.telegram${telegramEnabled ? "disconnect" : "connect"}`}
              />
            </CustomButton>
            <FormGroup>
              <NotificationCheckbox
                name="telegramNews"
                label="notifications.zignaly"
                control={control}
              />
              <NotificationCheckbox
                name="telegramOpenPosition"
                control={control}
                label="notifications.positionopened"
              />
              <NotificationCheckbox
                control={control}
                name="telegramUpdatePosition"
                label="notifications.positionupdate"
              />
              <NotificationCheckbox
                control={control}
                name="telegramSubscriptionWarning"
                label="notifications.warnings"
              />
              {/* <NotificationCheckbox name="" label="notifications.demo" /> */}
            </FormGroup>
            <CustomButton
              className="bgPurple updateButton"
              loading={updating}
              disabled={updating}
              type="submit"
            >
              <Typography className="bold" variant="body1">
                <FormattedMessage id="button.update" />
              </Typography>
            </CustomButton>
          </>
        ) : (
          <CircularProgress disableShrink size={21} className="loader" />
        )}
      </Box>
    </form>
  );
};

/**
 * @typedef {Object} NotificationCheckboxPropTypes
 * @property {string} name Checkbox name
 * @property {string} label Label translation id
 * @property {Control} control control
 */

/**
 * Provides a tip box.
 *
 * @param {NotificationCheckboxPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const NotificationCheckbox = ({ name, label, control }) => (
  <FormControlLabel
    control={<Controller as={Checkbox} control={control} name={name} defaultValue={false} />}
    label={<FormattedMessage id={label} />}
  />
);

export default NotificationsSettings;
