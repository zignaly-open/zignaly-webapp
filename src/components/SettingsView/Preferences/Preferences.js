import React, { useState } from "react";
import { Box, Checkbox, FormControlLabel, Tooltip, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { useDispatch } from "react-redux";
import { toggleBalanceBox } from "../../../store/actions/settings";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import { useStoreUserExchangeConnections } from "../../../hooks/useStoreUserSelector";
import ThemeSwitcher from "../../ThemeSwitcher";
import "./Preferences.scss";
import Modal from "components/Modal";
import TwoFAForm from "components/Forms/TwoFAForm";
import CustomButton from "components/CustomButton";
import { ConfirmDialog } from "components/Dialogs";
import { useStoreUserData } from "hooks/useStoreUserSelector";
import tradeApi from "services/tradeApiClient";
import useStoreSessionSelector from "hooks/useStoreSessionSelector";
import { showErrorAlert, showSuccessAlert } from "store/actions/ui";

const Preferences = () => {
  const dispatch = useDispatch();
  const storeSettings = useStoreSettingsSelector();
  const exchangeConnections = useStoreUserExchangeConnections();
  // const canDelete = !exchangeConnections.length;
  const canDelete = true;
  const userData = useStoreUserData();
  const [twoFAModal, showTwoFAModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const storeSession = useStoreSessionSelector();

  /**
   * @typedef {import("components/Dialogs/ConfirmDialog/ConfirmDialog").ConfirmDialogConfig} ConfirmDialogConfig
   * @type {ConfirmDialogConfig}
   */
  const initConfirmConfig = {
    titleTranslationId: "",
    messageTranslationId: "",
    visible: false,
  };

  const [confirmConfig, setConfirmConfig] = useState(initConfirmConfig);

  const check2FA = () => {
    if (userData.ask2FA) {
      showTwoFAModal(true);
    } else {
      startDeleteAccountProcess();
    }
  };

  /**
   *
   * @param {String} code two FA code.
   * @returns {void}
   */
  const startDeleteAccountProcess = (code = null) => {
    setLoading(true);
    const payload = {
      token: storeSession.tradeApi.accessToken,
      ...(code && { code }),
    };
    tradeApi
      .changeEmailRequest(payload)
      .then(() => {
        dispatch(showSuccessAlert("", "user.changeemail.alert"));
        dispatch(endTradeApiSession());
        navigateLogin();
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const confirmAction = () => {
    setConfirmConfig({
      titleTranslationId: "preferences.deleteaccount",
      messageTranslationId: "preferences.deleteaccount.confirm",
      visible: true,
    });
  };

  const getTooltip = () => {
    if (canDelete) {
      return "";
    }

    return (
      <Typography>
        <FormattedMessage id="preferences.deleteaccount.exchanges" />
      </Typography>
    );
  };

  return (
    <Box alignItems="flex-start" className="preferences" display="flex" flexDirection="column">
      <Box>
        <label className="customLabel">
          <FormattedMessage id="preferences.darklight" />
        </label>
        <ThemeSwitcher full={true} />
      </Box>
      <FormControlLabel
        control={
          <Checkbox
            checked={storeSettings.balanceBox}
            color="primary"
            onChange={() => dispatch(toggleBalanceBox(!storeSettings.balanceBox))}
          />
        }
        label={<FormattedMessage id="preferences.balance" />}
      />
      <Modal onClose={() => showTwoFAModal(false)} persist={false} size="small" state={twoFAModal}>
        <TwoFAForm data={userData} onComplete={startDeleteAccountProcess} />
      </Modal>
      <ConfirmDialog
        confirmConfig={confirmConfig}
        executeActionCallback={check2FA}
        setConfirmConfig={setConfirmConfig}
      />
      <Tooltip placement="top" title={getTooltip()} className="deleteButtonContainer">
        <span>
          <CustomButton
            className="deleteButton"
            disabled={!canDelete}
            loading={loading}
            onClick={confirmAction}
          >
            <FormattedMessage id="preferences.deleteaccount" />
          </CustomButton>
        </span>
      </Tooltip>
    </Box>
  );
};

export default Preferences;
