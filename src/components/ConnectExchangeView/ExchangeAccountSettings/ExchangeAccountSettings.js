import React, { useEffect, useContext, useState } from "react";
import { Box, Switch, FormControlLabel } from "@material-ui/core";
import ModalPathContext from "../ModalPathContext";
import { FormattedMessage, useIntl } from "react-intl";
import CustomButton from "../../CustomButton";
import CustomTooltip from "../../CustomTooltip";
import { Help } from "@material-ui/icons";
import ExchangeAccountForm from "../ExchangeAccountForm";
import { ConfirmDialog } from "../../Dialogs";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { removeUserExchange } from "../../../store/actions/user";

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
        <FormControlLabel
          control={<Switch onChange={() => {}} size="small" />}
          label={<FormattedMessage id="accounts.options.maxconcurrent" />}
          labelPlacement="start"
        />
        <CustomTooltip
          title={intl.formatMessage({
            id: "terminal.stoploss.help",
          })}
        >
          <Help />
        </CustomTooltip>
        <FormControlLabel
          control={<Switch onChange={() => {}} size="small" />}
          label={<FormattedMessage id="accounts.options.minvolume" />}
          labelPlacement="start"
        />
        <CustomButton className="body2 text-default" onClick={deleteExchangeShow}>
          <FormattedMessage id="accounts.delete.exchange" />
        </CustomButton>
      </ExchangeAccountForm>
    </form>
  );
};

export default ExchangeAccountSettings;
