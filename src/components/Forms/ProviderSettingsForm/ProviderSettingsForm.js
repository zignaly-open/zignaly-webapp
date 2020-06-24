import React, { useState } from "react";
import "./ProviderSettingsForm.scss";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Tooltip,
} from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../../../store/actions/ui";
import { FormattedMessage } from "react-intl";
import useQuoteAssets from "../../../hooks/useQuoteAssets";
import HelpIcon from "@material-ui/icons/Help";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../services/tradeApiClient.types').ProviderExchangeSettingsObject} settings
 */
/**
 * Provides the navigation bar for the dashboard.
 *
 * @param {DefaultProps} props Default props
 * @returns {JSX.Element} Component JSX.
 */

const ProviderSettingsForm = ({ settings }) => {
  const storeSettings = useStoreSettingsSelector();
  const quotes = useQuoteAssets();
  const [loading, setLoading] = useState(false);
  const { handleSubmit, control } = useForm();
  const dispatch = useDispatch();

  /**
   *
   * @param {String} key quotes object key.
   * @returns {String} Label for input.
   */
  const getLabel = (key) => {
    return `${key} Position size`;
  };

  /**
   *
   * @param {String} key quotes object key.
   * @param {Number} [num]
   * @returns {String} Label for input.
   */
  const getFieldName = (key, num) => {
    if (num === 1) {
      return "positionSize" + key + "Value";
    }
    if (num === 2) {
      return "positionSize" + key + "Unit";
    }

    return "positionSize" + key;
  };

  /**
   *
   * @param {String} key quotes object key.
   * @returns {String} Label for input.
   */
  const tooltip = (key) => {
    return (
      "Minimum value for " +
      key +
      " is " +
      quotes[key].minNotional +
      ", but if you want to use Stop Loss," +
      " or split your take profits into several targets, each target has to be above this minimum amount, " +
      "including the stop loss." +
      " You can choose a fixed value, or a percentage value of your total value for this coin (including the" +
      " conversion from opened positions). If you don't want to trade in " +
      key +
      ", just leave the value at 0."
    );
  };

  /**
   *
   * @param {Object} data Form data.
   * @returns {void} None.
   */
  const onSubmit = (data) => {
    try {
      setLoading(true);
      console.log(data);
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
    <Box bgcolor="grid.main" className="settingsFormWrapper" flexWrap="wrap">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" flexDirection="row" className="formBox">
          <Box
            alignItems="flex-start"
            className="amountsFormBox"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
          >
            <Typography variant="h3">
              <FormattedMessage id="srv.settings.amounts" />
            </Typography>

            {quotes &&
              Object.keys(quotes).map((item, index) => (
                <Box
                  key={index}
                  className="dynamicInputBox"
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                >
                  <label className="customLabel">{getLabel(item)}</label>
                  <Tooltip
                    placement="top"
                    title={<Typography variant="h5">{tooltip(item)}</Typography>}
                  >
                    <HelpIcon className="icon" />
                  </Tooltip>
                  <Box className="fieldInputBox" display="flex" flexDirection="row">
                    <Controller
                      as={
                        <TextField
                          className={
                            "customInput " + (storeSettings.darkStyle ? " dark " : " light ")
                          }
                          fullWidth
                          variant="outlined"
                        />
                      }
                      control={control}
                      /*@ts-ignore */
                      defaultValue={settings[getFieldName(item, 1)]}
                      name={getFieldName(item, 1)}
                    />

                    <Controller
                      as={
                        <Select className="selectInput" variant="outlined">
                          <MenuItem value="#">#</MenuItem>
                          <MenuItem value="%">%</MenuItem>
                        </Select>
                      }
                      control={control}
                      /*@ts-ignore */
                      defaultValue={settings[getFieldName(item, 2)]}
                      name={getFieldName(item, 2)}
                    />
                  </Box>
                </Box>
              ))}
          </Box>

          <Box
            alignItems="flex-start"
            className="strategyFormBox"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
          >
            <Typography variant="h3">
              <FormattedMessage id="srv.settings.strategy" />
            </Typography>
          </Box>
        </Box>

        <Box className="formAction" display="flex" flexDirection="row" justifyContent="flex-end">
          <CustomButton
            className="submitButton"
            loading={loading}
            onClick={handleSubmitClick}
            type="submit"
          >
            Save Changes
          </CustomButton>
        </Box>
      </form>
    </Box>
  );
};

export default ProviderSettingsForm;
