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
import { FormattedMessage, useIntl } from "react-intl";
import { useDispatch } from "react-redux";
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
  const storeSession = useStoreSessionSelector();
  const { handleSubmit, register, reset, control, errors } = useForm();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [telegramEnabled, enableTelegram] = useState(false);
  const intl = useIntl();

  const loadData = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
    };

    tradeApi
      .getProfileNotifications(payload)
      .then((data) => {
        setLoading(false);
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
      .then(() => {
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
            <Typography className="bold" variant="body1">
              <FormattedMessage id="notifications.email" />
            </Typography>
            <FormGroup>
              <NotificationCheckbox
                control={control}
                label="notifications.zignaly"
                name="emailNews"
              />
              <NotificationCheckbox
                control={control}
                label="notifications.positionopened"
                name="emailOpenPosition"
              />
              <NotificationCheckbox
                control={control}
                label="notifications.positionupdate"
                name="emailUpdatePosition"
              />
              <NotificationCheckbox
                control={control}
                label="notifications.warnings"
                name="emailSubscriptionWarning"
              />
              {/* <NotificationCheckbox name="" label="notifications.demo" /> */}
            </FormGroup>
            <Typography className="bold" variant="body1">
              Telegram
            </Typography>
            {telegramEnabled && (
              <Box className="inputBox" display="flex" flexDirection="column">
                <Alert className="codeInfo" severity="info">
                  <FormattedMessage
                    id="notifications.codeinfo"
                    values={{
                      url: (
                        <a href="https://t.me/ZignalyBot" rel="noopener noreferrer" target="_blank">
                          https://t.me/ZignalyBot
                        </a>
                      ),
                      command: <b>/getCode</b>,
                    }}
                  />
                </Alert>
                <label>
                  <Typography className="customLabel" variant="body1">
                    <FormattedMessage id="notifications.telegramcode" />
                  </Typography>
                  <OutlinedInput
                    className="customInput"
                    inputRef={register({
                      required: intl.formatMessage({ id: "form.error.telegram" }),
                    })}
                    name="telegramCode"
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
                control={control}
                label="notifications.zignaly"
                name="telegramNews"
              />
              <NotificationCheckbox
                control={control}
                label="notifications.positionopened"
                name="telegramOpenPosition"
              />
              <NotificationCheckbox
                control={control}
                label="notifications.positionupdate"
                name="telegramUpdatePosition"
              />
              <NotificationCheckbox
                control={control}
                label="notifications.warnings"
                name="telegramSubscriptionWarning"
              />
              {/* <NotificationCheckbox name="" label="notifications.demo" /> */}
            </FormGroup>
            <CustomButton
              className="bgPurple updateButton"
              disabled={updating}
              loading={updating}
              type="submit"
            >
              <Typography className="bold" variant="body1">
                <FormattedMessage id="action.update" />
              </Typography>
            </CustomButton>
          </>
        ) : (
          <CircularProgress className="loader" disableShrink size={21} />
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
    control={
      <Controller
        control={control}
        defaultValue={false}
        name={name}
        render={({ onChange, value }) => (
          <Checkbox checked={value} onChange={(e) => onChange(e.target.checked)} />
        )}
      />
    }
    label={<FormattedMessage id={label} />}
  />
);

export default NotificationsSettings;
