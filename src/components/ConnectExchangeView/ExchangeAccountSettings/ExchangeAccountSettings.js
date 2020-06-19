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

  // Submit form handle
  useImperativeHandle(
    formRef,
    () => ({
      submitForm,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const { register, errors, control } = useFormContext();
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
  }, [setTitle]);

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
          defaultValue={selectedAccount.internalName}
          errors={errors}
          inputRef={register({
            required: "name empty",
          })}
          label="accounts.exchange.name"
          name="internalName"
        />
        {accountExchange &&
          accountExchange.requiredAuthFields.map((field) => (
            <CustomInput
              autoComplete="new-password"
              inputRef={register}
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
          errors={errors}
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
          errors={errors}
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
          errors={errors}
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
          errors={errors}
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
          errors={errors}
          inputRef={register({
            required: "required",
          })}
          label="accounts.options.whitelist"
          name="globalWhitelist"
          tooltip="accounts.options.whitelist.help"
          type="textarea"
        />
        <CustomSwitch
          control={control}
          defaultValue={selectedAccount.globalDelisting}
          label="accounts.options.delisted"
          name="globalDelisting"
          tooltip="accounts.options.delisted.help"
        />

        <CustomButton className="body2 textDefault deleteButton" onClick={deleteExchangeShow}>
          <FormattedMessage id="accounts.delete.exchange" />
        </CustomButton>
      </ExchangeAccountForm>
    </form>
  );
};

export default ExchangeAccountSettings;
