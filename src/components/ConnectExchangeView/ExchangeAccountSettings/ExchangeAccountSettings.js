import React, { useEffect, useContext, useState, useCallback } from "react";
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
import { removeUserExchange } from "../../../store/actions/user";
import "./ExchangeAccountSettings.scss";
import useEvent from "../../../hooks/useEvent";
import { useForm, FormContext, Controller } from "react-hook-form";
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
  } = useContext(ModalPathContext);
  const intl = useIntl();
  const dispatch = useDispatch();
  const storeSession = useStoreSessionSelector();
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
  } = useForm();
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
  console.log(selectedAccount);

  const deleteExchangeShow = () => {
    setConfirmConfig({ ...initConfirmConfig, visible: true });
  };

  const deleteExchange = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      internalId: selectedAccount.internalId,
    };

    tradeApi
      .exchangeDelete(payload)
      .then(() => {
        removeUserExchange(selectedAccount.internalId);
        resetToPath(previousPath);
      })
      .catch((e) => {
        alert(`ERROR: ${e.message}`);
      });
  };

  const onSubmit = useCallback(() => {
    handleSubmit((data) => {
      console.log(dirtyFields, data);
      const { internalName, key, secret, password } = data;
      const payload = {
        token: storeSession.tradeApi.accessToken,
        exchangeId: selectedAccount.internalId,
        internalName,
        globalMaxPositions: data.globalMaxPositions || false,
        globalMinVolume: data.globalMinVolume || false,
        globalPositionsPerMarket: data.globalPositionsPerMarket || false,
        globalBlacklist: data.globalBlacklist || false,
        globalWhitelist: data.globalWhitelist || false,
        globalDelisting: data.globalDelisting || false,
        key,
        secret,
        ...(password && { password }),
      };
      console.log("payload", payload);

      tradeApi.exchangeUpdate(payload).then(() => {
        const authorizationPayload = {
          token: storeSession.tradeApi.accessToken,
        };
        dispatch(setUserExchanges(authorizationPayload));
        resetToPath(previousPath);
      });
    })();
  }, []);
  useEvent("submit", onSubmit);

  return (
    <form className="exchangeAccountSettings">
      <ConfirmDialog
        confirmConfig={confirmConfig}
        executeActionCallback={deleteExchange}
        setConfirmConfig={setConfirmConfig}
      />
      <ExchangeAccountForm>
        <CustomInput
          inputRef={register}
          name="internalName"
          label="accounts.exchange.name"
          defaultValue={selectedAccount.internalName}
        />
        {accountExchange &&
          accountExchange.requiredAuthFields.map((field) => (
            <CustomInput
              inputRef={register}
              name={field}
              //   name={`auth.${field}`}
              label={`accounts.exchange.${field}`}
              key={field}
              placeholder={
                selectedAccount.areKeysValid ? "***************************************" : ""
              }
            />
          ))}
        <CustomSwitchInput
          label={"accounts.options.maxconcurrent"}
          tooltip={"accounts.options.maxconcurrent.help"}
          defaultValue={selectedAccount.globalMaxPositions}
        />
        <CustomSwitchInput
          label={"accounts.options.minvolume"}
          tooltip={"accounts.options.minvolume.help"}
          defaultValue={selectedAccount.globalMinVolume}
          inputRef={register}
        />
        <CustomSwitchInput
          label={"accounts.options.limitpositions"}
          tooltip={"accounts.options.limitpositions.help"}
          defaultValue={selectedAccount.globalPositionsPerMarket}
          inputRef={register}
        />
        <CustomSwitchInput
          label={"accounts.options.blacklist"}
          tooltip={"accounts.options.blacklist.help"}
          defaultValue={selectedAccount.globalBlacklist}
          inputRef={register}
        />
        <CustomSwitchInput
          label={"accounts.options.whitelist"}
          tooltip={"accounts.options.whitelist.help"}
          defaultValue={selectedAccount.globalWhitelist}
          inputRef={register}
        />
        <CustomSwitch
          label={"accounts.options.delisted"}
          tooltip={"accounts.options.delisted.help"}
          defaultValue={selectedAccount.globalDelisting}
          inputRef={register}
        />

        <CustomButton className="body2 text-default" onClick={deleteExchangeShow}>
          <FormattedMessage id="accounts.delete.exchange" />
        </CustomButton>
      </ExchangeAccountForm>
    </form>
  );
};

export default ExchangeAccountSettings;
