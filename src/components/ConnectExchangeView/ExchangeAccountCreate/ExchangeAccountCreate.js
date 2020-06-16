import React, { useState } from "react";
import { Box, FormControlLabel, OutlinedInput, Typography } from "@material-ui/core";
import "./ExchangeAccountCreate.scss";
import { useForm, FormContext, Controller } from "react-hook-form";
import CustomSelect from "../../CustomSelect";
import { FormattedMessage, useIntl } from "react-intl";
import useExchangeList from "../../../hooks/useExchangeList";

/**
 * @typedef {import("../../../services/tradeApiClient.types").ExchangeListEntity} ExchangeListEntity
 */

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
  const [selectedExchange, setExchange] = useState(
    /** @type {ExchangeListEntity} */ ({
      type: [],
      requiredAuthFields: [],
      name: "",
    }),
  );
  // Select first option when available
  if (!selectedExchange.name && exchanges.length) setExchange(exchanges[0]);
  console.log(exchanges, selectedExchange);

  // Exchange options
  const exchangesOptions = exchanges
    .filter((e) => e.enabled && e.name.toLowerCase() !== "zignaly")
    .map((e) => e.name);

  // Eschange types
  const typeOptions = selectedExchange.type.map((t) => ({
    val: t,
    label: t.charAt(0).toUpperCase() + t.slice(1),
  }));

  //   const selectedExchange = getValues("exchangeName");
  const create = false;

  //   let exchangeTypes = [];
  //   if (selectedExchange) {
  //     exchangeTypes = exchange.type;
  //   }

  const onSubmit = (data) => {
    console.log(data);
  };

  const handleExchangeChange = (exchangeName) => {
    setExchange(exchanges.find((e) => e.name === exchangeName));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="exchangeAccountCreate">
      <Box
        display="flex"
        flexDirection="column"
        className="exchangeAccountForm"
        alignItems="flex-start"
      >
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
            value={selectedExchange.name}
            label={intl.formatMessage({ id: "accounts.exchange" })}
            onChange={handleExchangeChange}
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
        {selectedExchange.type.length > 1 && (
          <Controller
            as={CustomSelect}
            options={typeOptions}
            control={control}
            defaultValue={typeOptions.length ? typeOptions[0].val : null}
            name="exchangeType"
            rules={{ required: true }}
            label={intl.formatMessage({ id: "accounts.exchange.type" })}
          />
        )}
        <CustomInput
          inputRef={register}
          name="internalAccountName"
          label="accounts.exchange.name"
        />
        {selectedExchange.requiredAuthFields.map((field) => (
          <CustomInput
            inputRef={register}
            name={field}
            label={`accounts.exchange.${field}`}
            key={field}
          />
        ))}
      </Box>
    </form>
  );
};

const CustomInput = ({ inputRef, name, label }) => (
  <FormControlLabel
    control={<OutlinedInput className="customInput" inputRef={inputRef} name={name} />}
    label={
      <Typography className="accountLabel">
        <FormattedMessage id={label} />
      </Typography>
    }
    labelPlacement="start"
  />
);

export default ExchangeAccountCreate;
