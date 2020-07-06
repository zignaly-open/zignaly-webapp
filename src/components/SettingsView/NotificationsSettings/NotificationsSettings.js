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
import { showErrorAlert, showSuccessAlert } from "../../../store/actions/ui";
import { useForm, Controller } from "react-hook-form";
import CustomButton from "../../CustomButton";

/**
 * @typedef {import('../../../services/tradeApiClient.types').ProfileNotifications} ProfileNotifications
 */

const NotificationsSettings = () => {
  const dispatch = useDispatch();
  const storeSettings = useStoreSettingsSelector();
  const storeSession = useStoreSessionSelector();
  const { handleSubmit, register, reset, control } = useForm({
    // defaultValues: {
    //   emailNews: false,
    // },
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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
      notifications: {
        ...data,
        emailEnable:
          data.emailNews ||
          data.emailOpenPosition ||
          data.emailUpdatePosition ||
          data.emailSubscriptionWarning,
      },
    };

    setUpdating(true);
    return;

    tradeApi
      .updateProfileNotifications(payload)
      .then((data) => {
        showSuccessAlert("Success", "Notification settings updated.");
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
                // inputRef={register}
                control={control}
              />
              <NotificationCheckbox
                name="emailOpenPosition"
                label="notifications.positionopened"
                // inputRef={register}
                control={control}
              />
              <NotificationCheckbox
                name="emailUpdatePosition"
                // inputRef={register}
                control={control}
                label="notifications.positionupdate"
              />
              <NotificationCheckbox
                name="emailSubscriptionWarning"
                // inputRef={register}
                control={control}
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
                // inputRef={register}
                control={control}
              />
              <NotificationCheckbox
                name="telegramOpenPosition"
                // inputRef={register}
                control={control}
                label="notifications.positionopened"
              />
              <NotificationCheckbox
                // inputRef={register}
                control={control}
                name="telegramUpdatePosition"
                label="notifications.positionupdate"
              />
              <NotificationCheckbox
                // inputRef={register}
                control={control}
                name="telegramSubscriptionWarning"
                label="notifications.warnings"
              />
              {/* <NotificationCheckbox name="" label="notifications.demo" /> */}
            </FormGroup>
            <CustomButton className="bgPurple" loading={updating} disabled={updating} type="submit">
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
 * @property {React.Ref<any>} inputRef Ref
 */

/**
 * Provides a tip box.
 *
 * @param {NotificationCheckboxPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const NotificationCheckbox = ({ name, label, inputRef, control }) => (
  <FormControlLabel
    control={
      // <Checkbox inputRef={inputRef} name={name} color="primary" />
      <Controller
        as={Checkbox}
        control={control}
        name={name}
        type="checkbox"
        defaultValue={false}
      />
    }
    label={<FormattedMessage id={label} />}
  />
);

export default NotificationsSettings;
