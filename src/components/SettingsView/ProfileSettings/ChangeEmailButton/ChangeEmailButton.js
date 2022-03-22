import React, { useState } from "react";
import "./ChangeEmailButton.scss";
import { Box, CircularProgress, Tooltip } from "@mui/material";
import tradeApi from "../../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { showErrorAlert, showSuccessAlert } from "../../../../store/actions/ui";
import EditIcon from "@mui/icons-material/Edit";
import { FormattedMessage } from "react-intl";
import { endTradeApiSession } from "store/actions/session";
import { navigateLogin } from "services/navigation";
import { ConfirmDialog } from "../../../Dialogs";
import Modal from "../../../Modal";
import TwoFAForm from "../../../../components/Forms/TwoFAForm";
import { useStoreUserData } from "hooks/useStoreUserSelector";

const ChangeEmailButton = () => {
  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [twoFAModal, showTwoFAModal] = useState(false);
  const userData = useStoreUserData();

  /**
   * @typedef {import("../../../Dialogs/ConfirmDialog/ConfirmDialog").ConfirmDialogConfig} ConfirmDialogConfig
   * @type {ConfirmDialogConfig} initConfirmConfig
   */
  const initConfirmConfig = {
    titleTranslationId: "",
    messageTranslationId: "",
    visible: false,
  };

  const [confirmConfig, setConfirmConfig] = useState(initConfirmConfig);

  /**
   *
   * @returns {void} None.
   */
  const confirmChange = () => {
    setConfirmConfig({
      titleTranslationId: "changeemail.confirm.title",
      messageTranslationId: "changeemail.confirm.body",
      visible: true,
    });
  };

  const check2FA = () => {
    if (userData.ask2FA) {
      showTwoFAModal(true);
    } else {
      startChangeEmailProcess();
    }
  };

  /**
   *
   * @param {String} code two FA code.
   * @returns {void}
   */
  const startChangeEmailProcess = (code = null) => {
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

  return (
    <Box
      alignItems="center"
      className="changeEmailButton"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
    >
      <Modal onClose={() => showTwoFAModal(false)} persist={false} size="small" state={twoFAModal}>
        {loading && (
          <Box
            alignItems="center"
            className="loadingBox"
            display="flex"
            flexDirection="row"
            justifyContent="center"
          >
            <CircularProgress color="primary" size={35} />
          </Box>
        )}
        {!loading && <TwoFAForm onComplete={startChangeEmailProcess} />}
      </Modal>
      <ConfirmDialog
        confirmConfig={confirmConfig}
        executeActionCallback={check2FA}
        setConfirmConfig={setConfirmConfig}
      />
      {loading ? (
        <CircularProgress color="primary" size={29} />
      ) : (
        <Tooltip placement="top" title={<FormattedMessage id="profile.changeemailtext" />}>
          <span>
            <EditIcon className="emailEditIcon" color="primary" onClick={confirmChange} />
          </span>
        </Tooltip>
      )}
    </Box>
  );
};

export default ChangeEmailButton;
