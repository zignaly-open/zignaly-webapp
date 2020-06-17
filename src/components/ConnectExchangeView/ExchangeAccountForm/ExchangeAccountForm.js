import React, { useState, useCallback, useContext, useEffect } from "react";
import { Box, FormControlLabel, OutlinedInput, Typography } from "@material-ui/core";
import "./ExchangeAccountForm.scss";
import { useForm, FormContext, Controller } from "react-hook-form";
import CustomSelect from "../../CustomSelect";
import { FormattedMessage, useIntl } from "react-intl";
import useExchangeList from "../../../hooks/useExchangeList";
import useEvent from "../../../hooks/useEvent";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import ModalPathContext from "../ModalPathContext";
import { useDispatch } from "react-redux";
import { showLoader } from "../../../store/actions/ui";
import Loader from "../../Loader";

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
const ExchangeAccountForm = ({ children }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      className="exchangeAccountForm"
      alignItems="flex-start"
    >
      {children}
    </Box>
  );
};

export const CustomInput = ({ inputRef, name, label }) => (
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

export default ExchangeAccountForm;
