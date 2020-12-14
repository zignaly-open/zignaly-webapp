import React, { useState } from "react";
import "./ChangeEmailButton.scss";
import { Box, CircularProgress, Tooltip } from "@material-ui/core";
import tradeApi from "../../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { showErrorAlert, showSuccessAlert } from "../../../../store/actions/ui";
import EditIcon from "@material-ui/icons/Edit";
import { FormattedMessage } from "react-intl";
import { endTradeApiSession } from "store/actions/session";
import { navigateLogin } from "services/navigation";
import { ConfirmDialog } from "../../../Dialogs";

const ChangeEmailButton = () => {
  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

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

  const startChangeEmailProcess = () => {
    setLoading(true);
    const payload = {
      token: storeSession.tradeApi.accessToken,
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
      <ConfirmDialog
        confirmConfig={confirmConfig}
        executeActionCallback={startChangeEmailProcess}
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
