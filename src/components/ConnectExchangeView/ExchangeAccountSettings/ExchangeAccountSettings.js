import React, { useEffect, useContext, useState, useImperativeHandle } from "react";
import ModalPathContext from "../ModalPathContext";
import { FormattedMessage, useIntl } from "react-intl";
import CustomButton from "../../CustomButton";
import ExchangeAccountForm, {
  CustomSwitchInput,
  CustomInput,
  CustomSwitch,
} from "../ExchangeAccountForm";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import "./ExchangeAccountSettings.scss";
import { useFormContext } from "react-hook-form";
import useExchangeList from "../../../hooks/useExchangeList";
import { Typography } from "@material-ui/core";
import { showErrorAlert } from "../../../store/actions/ui";
import { Box, CircularProgress } from "@material-ui/core";
import ExchangeIcon from "../../ExchangeIcon";

/**
 * @typedef {import("@material-ui/core").OutlinedInputProps} OutlinedInputProps
 */

/**
 * Settings for selected exchange account.
 * @returns {JSX.Element} Component JSX.
 */
const ExchangeAccountSettings = () => {
  const {
    pathParams: { selectedAccount },
    setTitle,
    formRef,
    setTempMessage,
    setPathParams,
  } = useContext(ModalPathContext);
  const dispatch = useDispatch();
  const storeSession = useStoreSessionSelector();
  const intl = useIntl();

  const {
    register,
    setError,
    formState: { dirtyFields },
  } = useFormContext();
  const exchanges = useExchangeList();
  const accountExchange = exchanges
    ? exchanges.find((e) => e.id === selectedAccount.exchangeId)
    : null;
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTitle(
      <Box alignItems="center" display="flex" flexDirection="row">
        <FormattedMessage id="accounts.settings" />
        <span className="separator">-</span>
        <ExchangeIcon exchange={selectedAccount.name.toLowerCase()} size="xlarge" />
        <Typography variant="h3">{selectedAccount.internalName}</Typography>
      </Box>,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Expose submitForm handler to ref so it can be triggered from the parent.
  useImperativeHandle(
    formRef,
    () => ({ submitForm }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accountExchange],
  );

  const loadAccount = () => {
    const authorizationPayload = {
      token: storeSession.tradeApi.accessToken,
    };
    tradeApi.userExchangesGet(authorizationPayload).then((response) => {
      const account = response.find((a) => a.internalId === selectedAccount.internalId);
      setPathParams((params) => ({ ...params, selectedAccount: account }));
      setLoading(false);
    });
  };
  // Refresh accounts
  useEffect(loadAccount, []);

  /**
   *
   * @typedef {Object} FormData
   * @property {String} internalName
   * @property {String} key
   * @property {String} secret
   * @property {String} password
   * @property {string} globalMaxPositions
   * @property {string} globalMinVolume
   * @property {string} globalPositionsPerMarket
   * @property {string} globalBlacklist
   * @property {string} globalWhitelist
   * @property {boolean} globalDelisting
   */

  /**
   * Function to submit form.
   *
   * @param {FormData} data Form data.
   * @returns {Promise<boolean>} API promise.
   */
  const submitForm = async (data) => {
    const { internalName, key, secret, password } = data;
    const payload = {
      token: storeSession.tradeApi.accessToken,
      exchangeId: selectedAccount.exchangeId,
      internalId: selectedAccount.internalId,
      internalName,
      globalMaxPositions: data.globalMaxPositions || false,
      globalMinVolume: data.globalMinVolume || false,
      globalPositionsPerMarket: data.globalPositionsPerMarket || false,
      globalBlacklist: data.globalBlacklist || false,
      globalWhitelist: data.globalWhitelist || false,
      globalDelisting: data.globalDelisting || false,
      ...(key && { key }),
      ...(secret && { secret }),
      ...(password && { password }),
    };

    return tradeApi
      .exchangeUpdate(payload)
      .then(() => {
        setTempMessage(<FormattedMessage id={"accounts.settings.saved"} />);
        return true;
      })
      .catch((e) => {
        if (e.code === 72) {
          setError(
            accountExchange.requiredAuthFields[accountExchange.requiredAuthFields.length - 1],
            {
              type: "manual",
              message: intl.formatMessage({ id: "form.error.key.invalid" }),
            },
          );
        } else {
          dispatch(showErrorAlert(e));
        }
        return false;
      });
  };

  const authFieldsModified =
    accountExchange && Boolean(accountExchange.requiredAuthFields.find((f) => dirtyFields[f]));

  return (
    <form className="exchangeAccountSettings">
      {loading ? (
        <Box
          alignItems="center"
          className="loaderBox"
          display="flex"
          flex={1}
          justifyContent="center"
        >
          <CircularProgress color="primary" size={40} />
        </Box>
      ) : (
        <>
          <ConfirmDeleteDialog
            onClose={() => setConfirmDeleteDialog(false)}
            open={confirmDeleteDialog}
          />
          <ExchangeAccountForm>
            <Box className="typeBox" display="flex" flexDirection="row">
              <label>
                <Typography className="accountLabel">
                  <FormattedMessage id="accounts.exchange.type" />
                </Typography>
              </label>
              <Box width={1}>
                <Typography className="type" variant="body1">
                  {selectedAccount.exchangeType}
                </Typography>
              </Box>
            </Box>
            <CustomInput
              defaultValue={selectedAccount.internalName}
              inputRef={register({
                required: intl.formatMessage({ id: "form.error.name" }),
              })}
              label="accounts.exchange.name"
              name="internalName"
            />
            {!selectedAccount.paperTrading &&
              accountExchange &&
              accountExchange.requiredAuthFields.map((field) => (
                <CustomInput
                  autoComplete="new-password"
                  inputRef={register({
                    required: authFieldsModified
                      ? intl.formatMessage({ id: `form.error.${field}` })
                      : false,
                  })}
                  key={field}
                  label={`accounts.exchange.${field}`}
                  name={field}
                  placeholder={
                    selectedAccount.areKeysValid ? "***************************************" : ""
                  }
                  type="password"
                />
              ))}
            <CustomSwitchInput
              defaultValue={selectedAccount.globalMaxPositions}
              inputRef={register({
                required: intl.formatMessage({ id: "form.error.value" }),
              })}
              label="accounts.options.maxconcurrent"
              name="globalMaxPositions"
              tooltip="accounts.options.maxconcurrent.help"
              type="number"
            />
            <CustomSwitchInput
              defaultValue={selectedAccount.globalMinVolume}
              inputRef={register({
                required: intl.formatMessage({ id: "form.error.value" }),
              })}
              label="accounts.options.minvolume"
              name="globalMinVolume"
              tooltip="accounts.options.minvolume.help"
              type="number"
              unit="BTC"
            />
            <CustomSwitchInput
              defaultValue={selectedAccount.globalPositionsPerMarket}
              inputRef={register({
                required: intl.formatMessage({ id: "form.error.value" }),
              })}
              label="accounts.options.limitpositions"
              name="globalPositionsPerMarket"
              tooltip="accounts.options.limitpositions.help"
              type="number"
            />
            <CustomSwitchInput
              defaultValue={selectedAccount.globalBlacklist}
              inputRef={register({
                required: intl.formatMessage({ id: "form.error.value" }),
              })}
              label="accounts.options.blacklist"
              name="globalBlacklist"
              tooltip="accounts.options.blacklist.help"
              type="textarea"
            />
            <CustomSwitchInput
              defaultValue={selectedAccount.globalWhitelist}
              inputRef={register({
                required: intl.formatMessage({ id: "form.error.value" }),
              })}
              label="accounts.options.whitelist"
              name="globalWhitelist"
              tooltip="accounts.options.whitelist.help"
              type="textarea"
            />

            <CustomSwitch
              defaultValue={selectedAccount.globalDelisting}
              label="accounts.options.delisted"
              name="globalDelisting"
              tooltip="accounts.options.delisted.help"
            />

            <CustomButton className="deleteButton" onClick={() => setConfirmDeleteDialog(true)}>
              <Typography className="bold" variant="body1">
                <FormattedMessage id="accounts.delete.exchange" />
              </Typography>
            </CustomButton>
          </ExchangeAccountForm>
        </>
      )}
    </form>
  );
};

export default ExchangeAccountSettings;
