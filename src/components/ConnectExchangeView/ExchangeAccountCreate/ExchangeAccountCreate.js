import React, { useState } from "react";
import { Box, FormControlLabel, OutlinedInput, Typography } from "@material-ui/core";
import "./ExchangeAccountCreate.scss";
import { useForm, FormContext, Controller } from "react-hook-form";
import CustomSelect from "../../CustomSelect";
import { FormattedMessage, useIntl } from "react-intl";
import useExchangeList from "../../../hooks/useExchangeList";
/**
 * @typedef {Object} DefaultProps
 * @property {string} internalId Internal Exchange id.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ExchangeAccountCreate = ({}) => {
  const { register, handleSubmit, errors, control, getValues } = useForm();
  const intl = useIntl();
  const exchanges = useExchangeList();

  const exchangesOptions = exchanges
    .filter((e) => e.enabled && e.name !== "Zignaly")
    .map((e) => e.name);
  const [selectedExchange, setExchange] = useState("Binance");
  //   const selectedExchange = getValues("exchangeName");
  const create = false;

  let exchangeTypes = [];
  if (selectedExchange) {
    const exchange = exchanges.find((e) => e.name === selectedExchange);
    if (exchange) {
      exchangeTypes = exchange.type;
    }
  }

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box display="flex" flexDirection="column" className="exchangeAccountCreate">
        {create ? (
          <Box>Zignaly Exchange</Box>
        ) : (
          //   <Controller
          //     as={CustomSelect}
          //     options={exchangesOptions}
          //     control={control}
          //     // value={exchangesOptions.length ? exchangesOptions[0] : ""}
          //     defaultValue={val}
          //     // ref={register}
          //     name="exchangeName"
          //     rules={{ required: true }}
          //     label={intl.formatMessage({ id: "accounts.exchange" })}
          //   />
          <CustomSelect
            options={exchangesOptions}
            value={selectedExchange}
            label={intl.formatMessage({ id: "accounts.exchange" })}
            onChange={setExchange}
          />
        )}
        {/* <FormControl className="entryType">
          <RadioGroup aria-label="Entry Type" name="entryType">
            <FormControlLabel
              control={<Radio />}
              inputRef={register}
              label={<FormattedMessage id="col.side.long" />}
              value="LONG"
            />
            <FormControlLabel
              control={<Radio />}
              inputRef={register}
              label={<FormattedMessage id="col.side.short" />}
              value="SHORT"
            />
          </RadioGroup>
        </FormControl> */}
        {/* <CustomSelect name="accountType" options={accountTypes} /> */}
        {exchangeTypes.length > 1 && (
          <Controller
            as={CustomSelect}
            options={exchangeTypes}
            control={control}
            defaultValue={exchangeTypes.length ? exchangeTypes[0] : null}
            name="exchangeType"
            rules={{ required: true }}
            label={intl.formatMessage({ id: "accounts.exchange.type" })}
          />
        )}
        <FormControlLabel
          control={
            <OutlinedInput className="customInput" inputRef={register} name="internalName" />
          }
          label={
            <Typography className="callout2">
              <FormattedMessage id="accounts.exchange.name" />
            </Typography>
          }
          labelPlacement="start"
        />
      </Box>
    </form>
  );
};

export default ExchangeAccountCreate;
