import React from "react";
import { Box } from "@material-ui/core";
import {
  Checkbox,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  FormControlLabel,
  FormControl,
  Typography,
  OutlinedInput,
} from "@material-ui/core";
import { CheckBoxOutlineBlank, CheckBox, Help } from "@material-ui/icons";
import { Controller, useFormContext } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { ChevronDown } from "react-feather";
import CustomSelect from "../../../CustomSelect";
import CustomTooltip from "../../../CustomTooltip";
import "./ProviderUserOptions.scss";
import { validateURL } from "../../../../utils/validators";

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

/**
 * @typedef {import("../../../CustomSelect/CustomSelect").OptionType} OptionType
 * @typedef {Object} ProviderUserOptionsPropTypes
 * @property {Array<string>} quotes Quotes
 * @property {Array<OptionType>} exchangeOptions Exchanges
 */

/**
 * @param {ProviderUserOptionsPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const ProviderUserOptions = ({ exchangeOptions, quotes }) => {
  const { control, register, errors, getValues } = useFormContext();
  const intl = useIntl();

  const userOptions = [
    {
      id: "stopLossFromSignal",
      label: "signalp.settings.stoploss",
      tooltip: "signalp.useroption.stopLossFromSignal.help",
    },
    {
      id: "takeProfitsFromSignal",
      label: "signalp.settings.takeprofit",
      tooltip: "signalp.useroption.takeProfitsFromSignal.help",
    },
    {
      id: "acceptUpdateSignal",
      label: "signalp.useroption.acceptUpdateSignal",
      tooltip: "signalp.useroption.acceptUpdateSignal.help",
    },
    {
      id: "enableSellSignals",
      label: "signalp.useroption.enableSellSignals",
      tooltip: "signalp.useroption.enableSellSignals.help",
    },
    {
      id: "enablePanicSellSignals",
      label: "signalp.useroption.enablePanicSellSignals",
      tooltip: "signalp.useroption.enablePanicSellSignals.help",
    },
    {
      id: "allowSendingBuyOrdersAsMarket",
      label: "signalp.useroption.allowSendingBuyOrdersAsMarket",
      tooltip: "signalp.useroption.allowSendingBuyOrdersAsMarket.help",
    },
    {
      id: "reBuyFromProvider",
      label: "signalp.useroption.reBuyFromProvider",
      tooltip: "signalp.useroption.reBuyFromProvider.help",
    },
    {
      id: "reUseSignalIdIfClosed",
      label: "signalp.useroption.reUseSignalIdIfClosed",
      tooltip: "signalp.useroption.reUseSignalIdIfClosed.help",
    },
    {
      id: "limitPriceFromSignal",
      label: "signalp.useroption.limitPriceFromSignal",
      tooltip: "signalp.useroption.limitPriceFromSignal.help",
    },
    {
      id: "terms",
      label: "signalp.useroption.terms",
      tooltip: "signalp.useroption.terms.help",
    },
    {
      id: "riskFilter",
      label: "signalp.useroption.riskFilter",
      tooltip: "signalp.useroption.riskFilter.help",
    },
    {
      id: "successRateFilter",
      label: "signalp.useroption.successRateFilter",
      tooltip: "signalp.useroption.successRateFilter.help",
    },
    {
      id: "reBuysFromSignal",
      label: "signalp.useroption.reBuysFromSignal",
      tooltip: "signalp.useroption.reBuysFromSignal.help",
    },
    {
      id: "useLeverageFromSignal",
      label: "terminal.leverage",
      tooltip: "signalp.useroption.useLeverageFromSignal.help",
    },
    {
      id: "allowClones",
      label: "signalp.useroption.allowClones",
      tooltip: "signalp.useroption.allowClones.help",
    },
  ];

  /**
   * @param {string} ex exchange
   * @returns {Array<string>} exchanges
   */
  const toggleExchange = (ex) => {
    const values = getValues();
    /** @type {Array<string>} */
    const exchanges = values.exchanges;
    const newExchanges =
      exchanges && exchanges.includes(ex)
        ? exchanges.filter((e) => e !== ex)
        : [...(exchanges || []), ex];
    return newExchanges;
  };

  return (
    <div className="providerUserOptions">
      <ExpansionPanel classes={{ root: "accordion" }}>
        <ExpansionPanelSummary classes={{ root: "accordionSummary" }} expandIcon={<ChevronDown />}>
          <Typography variant="h3">
            <FormattedMessage id="signalp.general" />
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails classes={{ root: "accordionDetails" }}>
          <Box display="flex" flexDirection="column" width={1}>
            <FormControl classes={{ root: "inputBox listBox" }} error={!!errors.exchanges}>
              <label className="customLabel">
                <FormattedMessage id="srv.edit.exchanges" />
              </label>
              {exchangeOptions && (
                <Controller
                  control={control}
                  defaultValue={exchangeOptions.map((o) => o.val)}
                  name="exchanges"
                  render={(props) =>
                    // @ts-ignore
                    exchangeOptions.map((o) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            defaultChecked={true}
                            onChange={() =>
                              typeof o.val === "string" && props.onChange(toggleExchange(o.val))
                            }
                          />
                        }
                        key={o.val}
                        label={o.label}
                      />
                    ))
                  }
                  rules={{
                    validate: (value) =>
                      Boolean(value.length) || intl.formatMessage({ id: "form.error.exchanges" }),
                  }}
                />
              )}
              {errors && errors.exchanges && (
                <span className="errorText">{errors.exchanges.message}</span>
              )}
            </FormControl>
            {quotes.length && (
              <Box className="inputBox">
                <Controller
                  control={control}
                  defaultValue={quotes}
                  name="quotes"
                  render={({ onChange, value }) => (
                    <CustomSelect
                      disableCloseOnSelect
                      label={intl.formatMessage({
                        id: "srv.edit.quotes",
                      })}
                      labelPlacement="top"
                      multiple
                      onChange={onChange}
                      options={quotes}
                      renderOption={(option, { selected }) => (
                        <>
                          <Checkbox
                            checked={selected}
                            checkedIcon={checkedIcon}
                            icon={icon}
                            size="small"
                            style={{ marginRight: 8, padding: 5 }}
                          />
                          {option}
                        </>
                      )}
                      search
                      value={value}
                    />
                  )}
                  rules={{ required: true }}
                />
              </Box>
            )}
            <Box
              className="inputBox disclaimerBox"
              display="flex"
              flexDirection="column"
              width="50%"
            >
              <label className="customLabel">
                <FormattedMessage id="signalp.disclaimer" />
              </label>
              <OutlinedInput
                className="customInput"
                error={!!errors.disclaimer}
                fullWidth
                inputRef={register({
                  validate: (value) =>
                    !value || validateURL(value) || intl.formatMessage({ id: "form.error.url" }),
                })}
                name="disclaimer"
              />
              {errors.disclaimer && <span className="errorText">{errors.disclaimer.message}</span>}
            </Box>
          </Box>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel classes={{ root: "accordion" }}>
        <ExpansionPanelSummary classes={{ root: "accordionSummary" }} expandIcon={<ChevronDown />}>
          <Typography variant="h3">
            <FormattedMessage id="signalp.useroption.title" />
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails classes={{ root: "accordionDetails" }}>
          <Box display="flex" flexDirection="column" width={1}>
            <Box className="inputBox listBox" display="flex" flexDirection="column">
              {userOptions.map((o) => (
                <FormControlLabel
                  control={<Checkbox />}
                  defaultChecked={false}
                  inputRef={register}
                  key={o.id}
                  label={
                    <div className="optionLabel">
                      <FormattedMessage id={o.label} />
                      <CustomTooltip title={<FormattedMessage id={o.tooltip} />}>
                        <Help />
                      </CustomTooltip>
                    </div>
                  }
                  name={o.id}
                />
              ))}
            </Box>
          </Box>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};

export default ProviderUserOptions;
