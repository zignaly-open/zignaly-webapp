import React, { useState } from "react";
import "./ProviderOptionsForm.scss";
import { Box, Checkbox } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm, Controller } from "react-hook-form";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import { useDispatch } from "react-redux";
import tradeApi from "../../../services/tradeApiClient";
import { setProvider } from "../../../store/actions/views";
import { showErrorAlert } from "../../../store/actions/ui";
import { FormattedMessage } from "react-intl";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 */
/**
 * Provides the navigation bar for the dashboard.
 *
 * @param {DefaultProps} props Default props
 * @returns {JSX.Element} Component JSX.
 */

const ProviderOptionsForm = ({ provider }) => {
  const [loading, setLoading] = useState(false);
  const { errors, handleSubmit, control } = useForm();
  const dispatch = useDispatch();
  const storeSession = useStoreSessionSelector();
  const storeSettings = useStoreSettingsSelector();

  /**
   *
   * @typedef {Object} SubmitObject
   * @property {String} allocatedBalance
   */
  /**
   *
   * @param {SubmitObject} data Form data.
   * @returns {Promise<*>} Returns promise.
   */
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const payload = {
        allocatedBalance: data.allocatedBalance,
        balanceFilter: true,
        connected: provider.connected ? provider.connected : false,
        token: storeSession.tradeApi.accessToken,
        providerId: provider.id,
        exchangeInternalId: storeSettings.selectedExchange.internalId,
      };
      const response = await tradeApi.providerConnect(payload);
      if (response) {
        const payload2 = {
          token: storeSession.tradeApi.accessToken,
          providerId: provider.id,
          version: 2,
        };
        dispatch(setProvider(payload2));
        setLoading(false);
      }
    } catch (e) {
      dispatch(showErrorAlert(e));
    }
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
    <Box className="optionsFormWrapper">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          alignItems="center"
          className="providerOptionsForm"
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <Box className="inputBox" display="flex" flexDirection="row" alignItems="center">
            <Controller
              as={<Checkbox className="checkboxInput" />}
              control={control}
              /* @ts-ignore */
              defaultValue={true}
              name="name"
            />
            <label className={"customLabel"}>name</label>
          </Box>

          <Box className="formAction" display="flex" flexDirection="row" justifyContent="flex-end">
            <CustomButton
              className="submitButton"
              loading={loading}
              onClick={handleSubmitClick}
              type="submit"
            >
              Update
            </CustomButton>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default ProviderOptionsForm;
