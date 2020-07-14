import React, { useState } from "react";
import "./ClonedProviderEditForm.scss";
import { Box, TextField, Typography } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm, Controller } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import tradeApi from "../../../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { setProvider } from "../../../store/actions/views";
import "react-mde/lib/styles/css/react-mde-all.css";
import { showSuccessAlert } from "../../../store/actions/ui";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 */
/**
 * About us compoennt for CT profile.
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */

const CopyTraderEditProfileForm = ({ provider }) => {
  const [loading, setLoading] = useState(false);
  const storeSettings = useStoreSettingsSelector();
  const storeSession = useStoreSessionSelector();
  const { errors, handleSubmit, control } = useForm();
  const dispatch = useDispatch();

  /**
   *
   * @typedef {Object} SubmitObject
   * @property {String} name
   * @property {String} logoUrl
   */

  /**
   * Function to submit edit form.
   *
   * @param {SubmitObject} data Form data received at submit.
   * @returns {void} None.
   */
  const onSubmit = (data) => {
    setLoading(true);
    const payload = {
      ...data,
      token: storeSession.tradeApi.accessToken,
      providerId: provider.id,
    };
    tradeApi
      .clonedProviderEdit(payload)
      .then(() => {
        const payload2 = {
          token: payload.token,
          providerId: payload.providerId,
          version: 2,
        };
        dispatch(setProvider(payload2));
        dispatch(showSuccessAlert("alert.profileedit.title", "alert.profileedit.body"));
      })
      .catch((error) => {
        alert(error.message);
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        alignItems="center"
        className="cloneEditForm"
        display="flex"
        flexDirection="column"
        flexWrap="wrap"
        justifyContent="center"
      >
        <Typography variant="h3">
          <FormattedMessage id="srv.cloneform.title" />{" "}
        </Typography>

        <Box className="inputBox" display="flex" flexDirection="column">
          <label className={"customLabel"}>
            <FormattedMessage id="srv.edit.title" />
          </label>
          <Controller
            as={
              <TextField
                className={
                  "customInput " +
                  (storeSettings.darkStyle ? " dark " : " light ") +
                  (errors.name ? "error" : "")
                }
                fullWidth
                variant="outlined"
              />
            }
            control={control}
            defaultValue={provider.name}
            name="name"
            rules={{ required: true, maxLength: 50, pattern: /^([a-zA-Z0-9 ()$_-]+)$/ }}
          />
          {errors.name && (
            <span className="errorText">
              Name is reuired of max 50 characters. (Allowed characters, Numbers, Letters, $,-,_)
            </span>
          )}
        </Box>

        <Box className="inputBox" display="flex" flexDirection="column">
          <label className="customLabel">
            <FormattedMessage id="srv.edit.logo" />
          </label>
          <Controller
            as={
              <TextField
                className={
                  "customInput " +
                  (storeSettings.darkStyle ? " dark " : " light ") +
                  (errors.logoUrl ? "error" : "")
                }
                fullWidth
                variant="outlined"
              />
            }
            control={control}
            defaultValue={provider.logoUrl}
            name="logoUrl"
            rules={{ required: false, pattern: /^(ftp|http|https):\/\/[^ "]+$/ }}
          />
          {errors.logoUrl && (
            <span className="errorText">url should be valid. (eg: https://zignaly.com)</span>
          )}
        </Box>

        <Box className="formAction" display="flex" flexDirection="row" justifyContent="center">
          <CustomButton
            className={"full submitButton"}
            loading={loading}
            onClick={handleSubmitClick}
            type="submit"
          >
            <FormattedMessage id="action.saveData" />
          </CustomButton>
        </Box>
      </Box>
    </form>
  );
};

export default CopyTraderEditProfileForm;
