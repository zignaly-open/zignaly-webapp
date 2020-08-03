import React from "react";
import { Box } from "@material-ui/core";
import {
  Checkbox,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  FormControlLabel,
  FormLabel,
  FormControl,
  FormGroup,
  FormHelperText,
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

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

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

  const toggleExchange = (ex) => {
    const { exchanges } = getValues();
    const newExchanges =
      exchanges && exchanges.includes(ex)
        ? exchanges.filter((e) => e !== ex)
        : [...(exchanges || []), ex];
    return newExchanges;
  };

  return (
    <div className="providerUserOptions">
      <ExpansionPanel classes={{ root: "accordion" }}>
        <ExpansionPanelSummary expandIcon={<ChevronDown />} classes={{ root: "accordionSummary" }}>
          <Typography variant="h3">
            <FormattedMessage id="signalp.optional" />
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails classes={{ root: "accordionDetails" }}>
          <Box display="flex" flexDirection="column" width={1}>
            <FormControl error={!!errors.exchanges} classes={{ root: "inputBox listBox" }}>
              <label className="customLabel">
                <FormattedMessage id="srv.edit.exchanges" />
              </label>
              {exchangeOptions && (
                <Controller
                  name="exchanges"
                  render={(props) =>
                    exchangeOptions.map((o, index) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={() => props.onChange(toggleExchange(o.val))}
                            defaultChecked={true}
                          />
                        }
                        key={o.val}
                        label={o.label}
                      />
                    ))
                  }
                  control={control}
                  defaultValue={exchangeOptions.map((o) => o.val)}
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
                  as={CustomSelect}
                  control={control}
                  label={intl.formatMessage({
                    id: "srv.edit.quotes",
                  })}
                  name="quotes"
                  options={quotes}
                  rules={{ required: true }}
                  defaultValue={quotes}
                  search
                  multiple
                  renderOption={(option, { selected }) => (
                    <>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option}
                    </>
                  )}
                  disableCloseOnSelect
                  labelPlacement="top"
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
                    !value ||
                    value.startsWith("http") ||
                    intl.formatMessage({ id: "form.error.url" }),
                })}
                name="disclaimer"
              />
              {errors.disclaimer && <span className="errorText">{errors.disclaimer.message}</span>}
            </Box>
            <Box className="inputBox listBox" display="flex" flexDirection="column">
              <label className="customLabel">
                <FormattedMessage id="signalp.useroption.title" />
              </label>
              {userOptions.map((o) => (
                <FormControlLabel
                  control={<Checkbox />}
                  label={
                    <div className="optionLabel">
                      <FormattedMessage id={o.label} />
                      <CustomTooltip title={<FormattedMessage id={o.tooltip} />}>
                        <Help />
                      </CustomTooltip>
                    </div>
                  }
                  key={o.id}
                  inputRef={register}
                  defaultChecked={false}
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
