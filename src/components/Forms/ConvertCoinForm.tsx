import React, { useEffect, useState } from "react";
import useSelectedExchange from "hooks/useSelectedExchange";
import tradeApi from "../../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showSuccessAlert, showErrorAlert } from "../../store/actions/ui";
import { Typography, Box, CircularProgress } from "@material-ui/core";
import CustomButton from "components/CustomButton";
import { FormattedMessage, useIntl } from "react-intl";
import CustomSelect from "components/CustomSelect";
import { Controller, useForm } from "react-hook-form";
import { StyledCustomSelect } from "../WalletView/styles";
import AmountControl from "components/WalletView/AmountControl";
import useDebounce from "hooks/useDebounce";
import NumberFormat from "react-number-format";

interface ConvertCoinFormProps {
  balance: string;
  bases: string[];
  base: string;
  onClose: () => void;
  onRefreshCoins: () => void;
}

const ConvertCoinForm = ({
  bases,
  base,
  balance,
  onClose,
  onRefreshCoins,
}: ConvertCoinFormProps) => {
  const balanceData: BalanceData = {
    availableBalance: parseFloat(balance),
    balance: parseFloat(balance),
  };
  const [loading, setLoading] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const {
    handleSubmit,
    control,
    errors,
    formState: { isValid },
    setValue,
    watch,
    trigger,
  } = useForm({ mode: "onChange" });
  const selectedBase = watch("base", base);
  const selectedQuote = watch("quote");
  const amount = watch("amount");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewConversion, setPreviewConversion] = useState<ConvertCoinPreviewRes>(null);
  const selectedExchange = useSelectedExchange();
  const dispatch = useDispatch();
  const intl = useIntl();
  const debouncedAmount = useDebounce(amount, 1500);

  useEffect(() => {
    tradeApi
      .getQuoteAssetFromBase({
        base: selectedBase,
        internalExchangeId: selectedExchange.internalId,
      })
      .then((response) => {
        setQuotes(response.sort((a, b) => a.localeCompare(b)));
        if (selectedQuote && !response.includes(selectedQuote)) {
          // Selected quote not valid for new base
          setValue("quote", "");
        } else if (isFilled()) {
          // Selected base changed, force update preview.
          loadPreview();
        }
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  }, [selectedBase]);

  const loadPreview = () => {
    setPreviewConversion(null);
    setPreviewLoading(true);

    tradeApi
      .convertCoinPreview({
        from: selectedBase,
        to: selectedQuote,
        qty: amount,
      })
      .then((response) => {
        setPreviewConversion(response);
        // Update amount verification check. Without timeout, ROF doesn't check against updated minAmount...
        setTimeout(() => {
          trigger("amount");
        }, 0);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setPreviewLoading(false);
      });
  };

  const isFilled = () => selectedQuote && selectedBase && debouncedAmount;

  // Update preview on change
  useEffect(() => {
    if (isFilled()) {
      loadPreview();
    }
  }, [debouncedAmount, selectedQuote]);

  const submitForm = () => {
    setLoading(true);
    tradeApi
      .convertCoin({
        internalExchangeId: selectedExchange.internalId,
        from: selectedBase,
        to: selectedQuote,
        qty: amount,
      })
      .then(() => {
        dispatch(showSuccessAlert("", "convert.success"));
        onRefreshCoins();
        onClose();
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const setBalanceMax = () => {
    setValue("amount", balance);
    trigger("amount");
  };

  return (
    <Box alignItems="center" display="flex" flex={1} padding={4} flexDirection="column">
      <Typography align="center" variant="h3">
        <FormattedMessage id="convert.title" />
      </Typography>
      <form onSubmit={handleSubmit(submitForm)} style={{ width: "100%" }}>
        <Box mt={5} display="flex" flexDirection="column" alignItems="center">
          <StyledCustomSelect>
            <Controller
              control={control}
              defaultValue={base}
              name="base"
              render={({ onChange, value }) => (
                <CustomSelect
                  label={intl.formatMessage({ id: "transfer.internal.form.from" })}
                  labelPlacement="top"
                  onChange={onChange}
                  options={bases}
                  placeholder={intl.formatMessage({ id: "deposit.selectcoin" })}
                  search={true}
                  value={value}
                />
              )}
            />
          </StyledCustomSelect>

          <Box my={2} style={{ width: "100%" }}>
            <StyledCustomSelect>
              <Controller
                defaultValue=""
                control={control}
                name="quote"
                rules={{ required: true }}
                render={({ onChange, value }) => (
                  <CustomSelect
                    label={intl.formatMessage({ id: "transfer.internal.form.to" })}
                    labelPlacement="top"
                    options={quotes}
                    placeholder={intl.formatMessage({ id: "deposit.selectcoin" })}
                    search={true}
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </StyledCustomSelect>
          </Box>

          <AmountControl
            balance={balanceData}
            setBalanceMax={setBalanceMax}
            errors={errors}
            control={control}
            coin={base}
            minAmount={previewConversion?.min}
            decimals={8}
          />

          <Box display="flex" alignItems="center" height="100px" justifyContent="center">
            {previewLoading ? (
              <CircularProgress />
            ) : (
              previewConversion &&
              parseFloat(amount) >= previewConversion.min && (
                <>
                  <Typography>
                    <FormattedMessage id="convert.preview" />
                    &nbsp;
                    <NumberFormat
                      value={previewConversion.estimatedAmount}
                      displayType="text"
                      suffix={` ${selectedQuote}`}
                    />
                  </Typography>
                </>
              )
            )}
          </Box>

          <Box mt={2}>
            <CustomButton
              className="submitButton"
              loading={loading}
              type="submit"
              disabled={!isValid || !previewConversion}
            >
              <FormattedMessage id="accounts.convert" />
            </CustomButton>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default ConvertCoinForm;
