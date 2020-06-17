import React, { useEffect, useContext, useState } from "react";
import { Box, Switch, FormControlLabel } from "@material-ui/core";
import ModalPathContext from "../ModalPathContext";
import { FormattedMessage, useIntl } from "react-intl";
import CustomButton from "../../CustomButton";
import ExchangeAccountForm, { CustomSwitchInput } from "../ExchangeAccountForm";
import { ConfirmDialog } from "../../Dialogs";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { removeUserExchange } from "../../../store/actions/user";
import "./ExchangeAccountSettings.scss";

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

  return (
    <form className="exchangeAccountSettings">
      <ConfirmDialog
        confirmConfig={confirmConfig}
        executeActionCallback={deleteExchange}
        setConfirmConfig={setConfirmConfig}
      />
      <ExchangeAccountForm>
        <CustomSwitchInput
          label={"accounts.options.maxconcurrent"}
          tooltip={"accounts.options.maxconcurrent.help"}
        />
        <CustomSwitchInput
          label={"accounts.options.minvolume"}
          tooltip={"accounts.options.minvolume.help"}
        />
        <CustomButton className="body2 text-default" onClick={deleteExchangeShow}>
          <FormattedMessage id="accounts.delete.exchange" />
        </CustomButton>
      </ExchangeAccountForm>
    </form>
  );
};

export default ExchangeAccountSettings;
