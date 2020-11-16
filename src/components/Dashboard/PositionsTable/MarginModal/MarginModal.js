import React, { useState } from "react";
import CustomButton from "../../../CustomButton";
import tradeApiClient from "services/tradeApiClient";
import useStoreSettingsSelector from "hooks/useStoreSettingsSelector";
import { showErrorAlert, showSuccessAlert } from "store/actions/ui";
import { useDispatch } from "react-redux";
import { useIntl, FormattedMessage } from "react-intl";
import { Tabs, Tab, Box, OutlinedInput, Typography } from "@material-ui/core";
import { useForm } from "react-hook-form";
import "./MarginModal.scss";
import { formatNumber } from "utils/formatters";
import useBalance from "hooks/useBalance";

/**
 * @typedef {import("services/tradeApiClient.types").PositionEntity} PositionEntity
 */

/**
 * @typedef {Object} MarginModalProps
 * @property {PositionEntity} position
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
  const storeSettings = useStoreSettingsSelector();
  const intl = useIntl();
  const { register, handleSubmit, errors } = useForm();
  const maxMargin = 0;
  const balance = useBalance();

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
    return console.log(data);
    const { amount } = data;
    const payload = {
      internalExchangeId: storeSettings.selectedExchange.internalId,
      positionId,
      amount: parseFloat(amount) * (mode === "ADD" ? 1 : -1),
      token: storeSession.tradeApi.accessToken,
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
    <form onSubmit={handleSubmit(onSubmit)} className="marginModal">
      <Tabs value={mode} onChange={handleModeChange} aria-label="Margin Tabs">
        <Tab label={intl.formatMessage({ id: "margin.add" })} value="ADD" />
        <Tab label={intl.formatMessage({ id: "margin.remove" })} value="REMOVE" />
      </Tabs>
      <Box>
        <Box display="flex" flexDirection="row" className="amountInput">
          <OutlinedInput
            placeholder={intl.formatMessage({ id: "withdraw.amount" })}
            className="customInput"
            inputRef={register({
              min: 0,
              max: balance.totalAvailableBTC,
            })}
            name="amount"
            error={Boolean(errors.amount)}
          />
          <div className="currencyBox">XBT</div>
        </Box>
        <Box display="flex">
          <Typography>
            <FormattedMessage id="margin.current" />
          </Typography>
          <Typography>{formatNumber(position.margin)}</Typography>
        </Box>
        <Box display="flex">
          <Typography>
            <FormattedMessage id="deposit.available" />
          </Typography>
          <Typography>{formatNumber(balance.totalAvailableBTC)}</Typography>
        </Box>
      </Box>

      <CustomButton type="submit" loading={loading} className="submitButton">
        <FormattedMessage id="confirm.accept" />
      </CustomButton>
    </form>
  );
};

export default MarginModal;
