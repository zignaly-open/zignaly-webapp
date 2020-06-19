import React, { useEffect, useContext, useState, useCallback, useImperativeHandle } from "react";
import { Box, Switch, FormControlLabel } from "@material-ui/core";
import ModalPathContext from "../ModalPathContext";
import { FormattedMessage, useIntl } from "react-intl";
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
import useEvent from "../../../hooks/useEvent";
import { useForm, FormContext, Controller, useFormContext } from "react-hook-form";
import useExchangeList from "../../../hooks/useExchangeList";

/**
 * @typedef {Object} DefaultProps
 * @property {string} internalId Internal Exchange id.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ExchangeAccountSettings = ({ internalId }) => {
  const {
    pathParams: { selectedAccount, previousPath },
    setTitle,
    resetToPath,
    formRef,
    setTempMessage,
    setPathParams,
  } = useContext(ModalPathContext);
  const intl = useIntl();
  const dispatch = useDispatch();
  const storeSession = useStoreSessionSelector();

  // Submit form handle
  useImperativeHandle(
    formRef,
    () => ({
      submitForm,
    }),
    [],
  );

  const {
    register,
    handleSubmit,
    errors,
    control,
    getValues,
    setValue,
    watch,
    reset,
    formState,
  } = useFormContext();
  const { dirtyFields } = formState;
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
  }, []);

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
        setPathParams((state) => ({
          tempMessage: <FormattedMessage id={"accounts.deleted"} />,
          currentPath: previousPath,
        }));
      })
      .catch((e) => {
        alert(`ERROR: ${e.message}`);
      });
  };

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

    return tradeApi.exchangeUpdate(payload).then(() => {
      const authorizationPayload = {
        token: storeSession.tradeApi.accessToken,
      };
      dispatch(setUserExchanges(authorizationPayload));
      setTempMessage(<FormattedMessage id={"accounts.settings.saved"} />);
      return true;
    });
  };

  return (
    <form className="exchangeAccountSettings">
      <ConfirmDialog
        confirmConfig={confirmConfig}
        executeActionCallback={deleteExchange}
        setConfirmConfig={setConfirmConfig}
      />
      <ExchangeAccountForm>
        <CustomInput
          inputRef={register({
            required: "name empty",
          })}
          name="internalName"
          label="accounts.exchange.name"
          defaultValue={selectedAccount.internalName}
          errors={errors}
        />
        {accountExchange &&
          accountExchange.requiredAuthFields.map((field) => (
            <CustomInput
              inputRef={register}
              name={field}
              label={`accounts.exchange.${field}`}
              key={field}
              placeholder={
                selectedAccount.areKeysValid ? "***************************************" : ""
              }
              autoComplete="new-password"
              type="password"
            />
          ))}
        <CustomSwitchInput
          label="accounts.options.maxconcurrent"
          tooltip="accounts.options.maxconcurrent.help"
          defaultValue={selectedAccount.globalMaxPositions}
          inputRef={register({
            required: "required",
          })}
          errors={errors}
          name="globalMaxPositions"
          type="number"
        />
        <CustomSwitchInput
          label="accounts.options.minvolume"
          tooltip="accounts.options.minvolume.help"
          defaultValue={selectedAccount.globalMinVolume}
          name="globalMinVolume"
          inputRef={register({
            required: "required",
          })}
          errors={errors}
          type="number"
          unit="BTC"
        />
        <CustomSwitchInput
          label="accounts.options.limitpositions"
          tooltip="accounts.options.limitpositions.help"
          defaultValue={selectedAccount.globalPositionsPerMarket}
          name="globalPositionsPerMarket"
          inputRef={register({
            required: "required",
          })}
          errors={errors}
          type="number"
        />
        <CustomSwitchInput
          label="accounts.options.blacklist"
          tooltip="accounts.options.blacklist.help"
          defaultValue={selectedAccount.globalBlacklist}
          name="globalBlacklist"
          inputRef={register({
            required: "required",
          })}
          errors={errors}
          type="textarea"
        />
        <CustomSwitchInput
          label="accounts.options.whitelist"
          tooltip="accounts.options.whitelist.help"
          defaultValue={selectedAccount.globalWhitelist}
          name="globalWhitelist"
          inputRef={register({
            required: "required",
          })}
          errors={errors}
          type="textarea"
        />
        <CustomSwitch
          label="accounts.options.delisted"
          tooltip="accounts.options.delisted.help"
          name="globalDelisting"
          defaultValue={selectedAccount.globalDelisting}
          control={control}
        />

        <CustomButton className="body2 textDefault deleteButton" onClick={deleteExchangeShow}>
          <FormattedMessage id="accounts.delete.exchange" />
        </CustomButton>
      </ExchangeAccountForm>
    </form>
  );
};

export default ExchangeAccountSettings;
