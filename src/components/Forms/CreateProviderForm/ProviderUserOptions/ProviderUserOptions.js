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
import { CheckBoxOutlineBlank, CheckBox } from "@material-ui/icons";
import { Controller, useFormContext } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { ChevronDown } from "react-feather";
import CustomSelect from "../../../CustomSelect";

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

const ProviderUserOptions = ({
  selectedExchanges,
  setSelectedExchanges,
  exchangeOptions,
  quotes,
}) => {
  const { control, register, errors } = useFormContext();
  const intl = useIntl();

  const userOptions = [
    {
      id: "stopLossFromSignal",
      label: "signalp.settings.stoploss",
      tooltip: "signalp.useroption.stopLossFromSignal.help",
    },
    {
      id: "acceptUpdateSignal",
      label: "signalp.useroption.acceptUpdateSignal",
      tooltip: "signalp.useroption.acceptUpdateSignal.help",
    },
    {
      id: "takeProfitsFromSignal",
      label: "signalp.settings.takeprofit",
      tooltip: "signalp.useroption.takeProfitsFromSignal.help",
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
      id: "limitPriceFromSignal",
      label: "signalp.useroption.limitPriceFromSignal",
      tooltip: "signalp.useroption.limitPriceFromSignal.help",
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
    const i = selectedExchanges.findIndex((e) => e === ex);
    if (i != -1) {
      setSelectedExchanges((value) => value.filter((e) => e !== ex));
    } else {
      setSelectedExchanges((value) => [...value, ex]);
    }
  };

  console.log("a", exchangeOptions);

  return (
    <>
      <ExpansionPanel classes={{ root: "accordion" }}>
        <ExpansionPanelSummary expandIcon={<ChevronDown />} classes={{ root: "accordionSummary" }}>
          <Typography variant="h3">
            <FormattedMessage id="signalp.optional" />
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails classes={{ root: "accordionDetails" }}>
          <Box display="flex" flexDirection="column" width={1}>
            <FormControl
              error={!!errors.exchanges}
              fullWidth={false}
              classes={{ root: "inputBox listBox" }}
            >
              <label className="customLabel">
                <FormattedMessage id="srv.edit.exchanges" />
              </label>
              {/* <FormGroup>
                {exchangeOptions.map((e) => (
                  <FormControlLabel
                    control={
                    //   <Checkbox
                    //     checked={selectedExchanges.includes(e.val)}
                    //     onChange={() => toggleExchange(e.val)}
                    //         />
                  <Controller as={Checkbox} control={control} defaultValue={false} name={o.id} />

                    }
                    label={e.label}
                    key={e.val}
                  />
                ))}
              </FormGroup> */}
              {exchangeOptions && (
                <Controller
                  name="exchanges"
                  render={(props) =>
                    exchangeOptions.map((o, index) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={() => props.onChange(toggleExchange(o.val))}
                            defaultChecked={selectedExchanges.includes(o.val)}
                          />
                        }
                        key={o.val}
                        label={o.label}
                      />
                    ))
                  }
                  control={control}
                  // defaultValue={exchangeOptions.map((o) => o.val)}
                />
              )}
              {/* <FormHelperText>{errors.exchanges && errors.exchanges.message}</FormHelperText> */}
              {errors && errors.exchanges && (
                <span className="errorText">{errors.exchanges.message}</span>
              )}
            </FormControl>
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
                error={!!errors.name}
                fullWidth
                inputRef={register({
                  validate: (value) =>
                    value.startsWith("http") || intl.formatMessage({ id: "form.error.url" }),
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
                  control={
                    <Controller as={Checkbox} control={control} defaultValue={false} name={o.id} />
                  }
                  label={<FormattedMessage id={o.label} />}
                  key={o.id}
                />
              ))}
            </Box>
            {/* <CustomSelect
              multiple
              renderOption={(option, { selected }) => (
                <>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.title}
                </>
              )}
              options={options}
            /> */}
            {quotes.length && (
              <Box className="inputBox ">
                <Controller
                  as={CustomSelect}
                  control={control}
                  label={intl.formatMessage({
                    id: "srv.edit.quotes",
                  })}
                  name="quotes"
                  //   onChange={([e]) => {
                  //     setValue("exchangeType", typeOptions[0].val);
                  //     setValue("testnet", false);
                  //     return e;
                  //   }}
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
            {/* <FormControl>
              <label>
                <FormattedMessage id="accounts.exchange" />
              </label>
              <FormGroup>
                {quotes.map((q) => (
                  <FormControlLabel
                    control={<Checkbox ref={register} name={`quotes.${q}`} />}
                    label={q}
                  />
                ))}
              </FormGroup>
              <FormHelperText>Be careful</FormHelperText>
            </FormControl> */}
          </Box>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </>
  );
};

export default ProviderUserOptions;
