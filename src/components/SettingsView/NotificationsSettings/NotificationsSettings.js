import React, { useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { useDispatch } from "react-redux";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import "./NotificationsSettings.scss";
import tradeApi from "../../../services/tradeApiClient";
import { showErrorAlert } from "../../../store/actions/ui";
import { useForm } from "react-hook-form";

/**
 * @typedef {import('../../../services/tradeApiClient.types').ProfileNotifications} ProfileNotifications
 */

const NotificationsSettings = () => {
  const dispatch = useDispatch();
  const storeSettings = useStoreSettingsSelector();
  const storeSession = useStoreSessionSelector();
  const { handleSubmit, register, reset } = useForm();
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
    };

    tradeApi
      .getProfileNotifications(payload)
      .then((data) => {
        setLoading(false);
        console.log(data);
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
      notifications: data,
    };

    tradeApi
      .updateProfileNotifications(payload)
      .then((data) => {
        // setBases(data);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
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
                inputRef={register}
              />
              <NotificationCheckbox
                name="emailOpenPosition"
                label="notifications.positionopened"
                inputRef={register}
              />
              <NotificationCheckbox
                name="emailUpdatePosition"
                inputRef={register}
                label="notifications.positionupdate"
              />
              <NotificationCheckbox
                name="emailSubscriptionWarning"
                inputRef={register}
                label="notifications.warnings"
              />
              {/* <NotificationCheckbox name="" label="notifications.demo" /> */}
            </FormGroup>
            <Typography variant="body1" className="bold">
              Telegram
            </Typography>
            <FormGroup>
              <NotificationCheckbox
                name="telegramNews"
                label="notifications.zignaly"
                inputRef={register}
              />
              <NotificationCheckbox
                name="telegramOpenPosition"
                inputRef={register}
                label="notifications.positionopened"
              />
              <NotificationCheckbox
                inputRef={register}
                name="telegramUpdatePosition"
                label="notifications.positionupdate"
              />
              <NotificationCheckbox
                inputRef={register}
                name="telegramSubscriptionWarning"
                label="notifications.warnings"
              />
              {/* <NotificationCheckbox name="" label="notifications.demo" /> */}
            </FormGroup>
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
 * @property {React.Ref<any>} inputRef Ref
 */

/**
 * Provides a tip box.
 *
 * @param {NotificationCheckboxPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const NotificationCheckbox = ({ name, label, inputRef }) => (
  <FormControlLabel
    control={<Checkbox inputRef={inputRef} name={name} color="primary" />}
    label={<FormattedMessage id={label} />}
  />
);

export default NotificationsSettings;
