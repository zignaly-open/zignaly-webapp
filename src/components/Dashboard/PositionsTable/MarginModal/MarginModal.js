import React, { useState } from "react";
import CustomButton from "../../../CustomButton";
import tradeApiClient from "services/tradeApiClient";
import useSelectedExchange from "hooks/useSelectedExchange";
import { showErrorAlert, showSuccessAlert } from "store/actions/ui";
import { useDispatch } from "react-redux";
import { useIntl, FormattedMessage } from "react-intl";
import {
  Tabs,
  Tab,
  Box,
  OutlinedInput,
  Typography,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import "./MarginModal.scss";
import { formatNumber } from "utils/formatters";
import useBalance from "hooks/useBalance";

/**
 * @typedef {Object} MarginModalProps
 * @property {Position} position
 * @property {function} onClose
 */
/**
 * Display modal to adjust position margin.
 *
 * @param {MarginModalProps} props Component properties.
 * @returns {JSX.Element} JSX.
 */
const MarginModal = ({ position, onClose }) => {
  const [mode, setMode] = useState("ADD");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const selectedExchange = useSelectedExchange();
  const intl = useIntl();
  const { register, handleSubmit, errors } = useForm();
  const { balance, balanceLoading } = useBalance(selectedExchange.internalId);
  const maxRemoveableMargin =
    position.margin -
    (position.positionSizeQuote + position.unrealizedProfitLosses + position.profit);

  /**
   * @param {React.ChangeEvent} event .
   * @param {string} newValue .
   * @returns {void}
   */
  const handleModeChange = (event, newValue) => {
    setMode(newValue);
  };

  /**
   * @typedef {Object} FormData
   * @prop {string} amount
   */

  /**
   * @param {FormData} data .
   * @returns {void}
   */
  const onSubmit = (data) => {
    const { amount } = data;
    const payload = {
      internalExchangeId: selectedExchange.internalId,
      positionId: position.positionId,
      amount: parseFloat(amount) * (mode === "ADD" ? 1 : -1),
    };
    setLoading(true);

    tradeApiClient
      .transferMargin(payload)
      .then(() => {
        dispatch(showSuccessAlert("", intl.formatMessage({ id: "margin.success" })));
        onClose();
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form className="marginModal" onSubmit={handleSubmit(onSubmit)}>
      <Tabs
        aria-label="Margin Tabs"
        className="tabs"
        classes={{ flexContainer: "marginTabsContainer" }}
        onChange={handleModeChange}
        value={mode}
      >
        <Tab
          classes={{ selected: "selected" }}
          label={intl.formatMessage({ id: "margin.add" })}
          value="ADD"
        />
        <Tab
          classes={{ selected: "selected" }}
          label={intl.formatMessage({ id: "margin.remove" })}
          value="REMOVE"
        />
      </Tabs>

      {balanceLoading && (
        <Box
          alignItems="center"
          className="loadingBox"
          display="flex"
          flexDirection="row"
          justifyContent="center"
        >
          <CircularProgress color="primary" size={35} />
        </Box>
      )}
      {!balanceLoading && (
        <Box className="marginBox">
          <Box className="amountInput" display="flex" flexDirection="row">
            <OutlinedInput
              className="customInput"
              endAdornment={<InputAdornment position="end">XBT</InputAdornment>}
              error={Boolean(errors.amount)}
              inputProps={{
                min: 0,
                step: "any",
              }}
              inputRef={register({
                validate: (value) =>
                  !isNaN(value) &&
                  parseFloat(value) >= 0 &&
                  parseFloat(value) < balance.totalAvailableBTC,
              })}
              // doesn't work with mui for some reason?
              // inputRef={register({
              //   required: true,
              //   min: 0,
              //   max: balance.totalAvailableBTC,
              // })}
              name="amount"
              placeholder={intl.formatMessage({ id: "withdraw.amount" })}
              type="number"
            />
          </Box>
          <Box className="line" display="flex" justifyContent="center">
            <Typography className="callout1">
              <FormattedMessage id="margin.current" />: {formatNumber(position.margin)} XBT
            </Typography>
          </Box>
          <Box className="line" display="flex" justifyContent="center">
            {mode === "ADD" ? (
              <Typography className="callout1">
                <FormattedMessage id="deposit.available" />:{" "}
                {formatNumber(balance.totalAvailableBTC)} XBT
              </Typography>
            ) : (
              <Typography className="callout1">
                <FormattedMessage id="margin.maxremoveable" />:{" "}
                {formatNumber(maxRemoveableMargin <= 0 ? 0 : maxRemoveableMargin)}
                XBT
              </Typography>
            )}
          </Box>
        </Box>
      )}

      <CustomButton
        className="submitButton"
        disabled={balanceLoading || loading || (mode === "REMOVE" && maxRemoveableMargin <= 0)}
        loading={loading}
        type="submit"
      >
        <FormattedMessage id="confirm.accept" />
      </CustomButton>
    </form>
  );
};

export default MarginModal;
