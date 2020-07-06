import React, { useEffect, useContext, useState, useImperativeHandle } from "react";
import ModalPathContext from "../ModalPathContext";
import { FormattedMessage } from "react-intl";
import CustomButton from "../../CustomButton";
import ExchangeAccountForm, {
  CustomSwitchInput,
  CustomInput,
  CustomSwitch,
} from "../ExchangeAccountForm";
import { ConfirmDialog } from "../../Dialogs";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { removeUserExchange, setUserExchanges } from "../../../store/actions/user";
import "./ExchangeAccountSettings.scss";
import { useFormContext } from "react-hook-form";
import useExchangeList from "../../../hooks/useExchangeList";
import { Typography } from "@material-ui/core";
import { showErrorAlert } from "../../../store/actions/ui";
import { Box } from "@material-ui/core";

/**
 * @typedef {import("@material-ui/core").OutlinedInputProps} OutlinedInputProps
 */

/**
 * Settings for selected exchange account.
 * @returns {JSX.Element} Component JSX.
 */
const ExchangeAccountSettings = () => {
  const {
    pathParams: { selectedAccount, previousPath },
    setTitle,
    formRef,
    setTempMessage,
    setPathParams,
  } = useContext(ModalPathContext);
  const dispatch = useDispatch();
  const storeSession = useStoreSessionSelector();

  const {
    register,
    setError,
    formState: { dirtyFields },
  } = useFormContext();
  const exchanges = useExchangeList();
  const accountExchange = exchanges.find((e) => e.id === selectedAccount.exchangeId);

  /**
   * @typedef {import("../../Dialogs/ConfirmDialog/ConfirmDialog").ConfirmDialogConfig} ConfirmDialogConfig
   * @type {ConfirmDialogConfig} initConfirmConfig
   */
  const initConfirmConfig = {
    titleTranslationId: "confirm.deleteexchange.title",
    messageTranslationId: "confirm.deleteexchange.message",
    visible: false,
  };
  const [confirmConfig, setConfirmConfig] = useState(initConfirmConfig);

  useEffect(() => {
    setTitle(<FormattedMessage id="accounts.settings" />);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Expose submitForm handler to ref so it can be triggered from the parent.
  useImperativeHandle(
    formRef,
    () => ({ submitForm }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accountExchange],
  );

  const deleteExchangeShow = () => {
    setConfirmConfig({ ...initConfirmConfig, visible: true });
  };

  const deleteExchange = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      internalId: selectedAccount.internalId,
    };

    setPathParams((state) => ({ ...state, isLoading: true }));

    tradeApi
      .exchangeDelete(payload)
      .then(() => {
        dispatch(removeUserExchange(selectedAccount.internalId));
        setPathParams({
          tempMessage: <FormattedMessage id={"accounts.deleted"} />,
          currentPath: previousPath,
        });
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };

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
        const authorizationPayload = {
          token: storeSession.tradeApi.accessToken,
        };
        dispatch(setUserExchanges(authorizationPayload));
        setTempMessage(<FormattedMessage id={"accounts.settings.saved"} />);
        return true;
      })
      .catch((e) => {
        if (e.code === 72) {
          setError(
            accountExchange.requiredAuthFields[accountExchange.requiredAuthFields.length - 1],
            "notMatch",
            "The provided api key/secret pair is not valid.",
          );
        } else {
          dispatch(showErrorAlert(e));
        }
        return false;
      });
  };

  const authFieldsModified =
    accountExchange && Boolean(accountExchange.requiredAuthFields.find((f) => dirtyFields.has(f)));

  return (
    <form className="exchangeAccountSettings">
      <ConfirmDialog
        confirmConfig={confirmConfig}
        executeActionCallback={deleteExchange}
        setConfirmConfig={setConfirmConfig}
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
            required: "name empty",
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
                required: authFieldsModified ? `${field} empty` : false,
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
            required: "required",
          })}
          label="accounts.options.maxconcurrent"
          name="globalMaxPositions"
          tooltip="accounts.options.maxconcurrent.help"
          type="number"
        />
        <CustomSwitchInput
          defaultValue={selectedAccount.globalMinVolume}
          inputRef={register({
            required: "required",
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
            required: "required",
          })}
          label="accounts.options.limitpositions"
          name="globalPositionsPerMarket"
          tooltip="accounts.options.limitpositions.help"
          type="number"
        />
        <CustomSwitchInput
          defaultValue={selectedAccount.globalBlacklist}
          inputRef={register({
            required: "required",
          })}
          label="accounts.options.blacklist"
          name="globalBlacklist"
          tooltip="accounts.options.blacklist.help"
          type="textarea"
        />
        <CustomSwitchInput
          defaultValue={selectedAccount.globalWhitelist}
          inputRef={register({
            required: "required",
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

        <CustomButton className="textDefault deleteButton" onClick={deleteExchangeShow}>
          <Typography className="bold" variant="body1">
            <FormattedMessage id="accounts.delete.exchange" />
          </Typography>
        </CustomButton>
      </ExchangeAccountForm>
    </form>
  );
};

export default ExchangeAccountSettings;
