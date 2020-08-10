import React, { useState, useEffect } from "react";
import "./CopyTraderButton.scss";
import { Box, Typography, Tooltip } from "@material-ui/core";
import CustomButton from "../../../CustomButton";
import { FormattedMessage } from "react-intl";
import Modal from "../../../Modal";
import CopyTraderForm from "../../../Forms/CopyTraderForm";
import tradeApi from "../../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { setProvider } from "../../../../store/actions/views";
import useStoreSettingsSelector from "../../../../hooks/useStoreSettingsSelector";
import ExchangeIcon from "../../../ExchangeIcon";
import { useStoreUserExchangeConnections } from "../../../../hooks/useStoreUserSelector";
import { showErrorAlert, showSuccessAlert } from "../../../../store/actions/ui";
import ConnectExchange from "../../../Modal/ConnectExchange";
import { ConfirmDialog } from "../../../Dialogs";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 */
/**
 * Provides the navigation bar for the dashboard.
 *
 * @param {DefaultProps} props Default props
 * @returns {JSX.Element} Component JSX.
 */
const CopyTraderButton = ({ provider }) => {
  const storeSession = useStoreSessionSelector();
  const storeSettings = useStoreSettingsSelector();
  const exchangeConnections = useStoreUserExchangeConnections();
  const dispatch = useDispatch();
  const [copyModal, showCopyModal] = useState(false);
  const [connectModal, showConnectModal] = useState(false);
  const [stopCopyLoader, setStopCopyLoader] = useState(false);
  const [followingFrom, setFollowingFrom] = useState({ internalName: "", name: "" });

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

  const confirmAction = () => {
    setConfirmConfig({
      titleTranslationId: "confirm.copyt.unfollow.title",
      messageTranslationId: "confirm.copyt.unfollow.message",
      visible: true,
    });
  };

  const startCopying = () => {
    if (exchangeConnections.length) {
      showCopyModal(true);
    } else {
      showConnectModal(true);
    }
  };

  const stopCopying = async () => {
    try {
      setStopCopyLoader(true);
      const payload = {
        disable: true,
        token: storeSession.tradeApi.accessToken,
        providerId: provider.id,
        type: "connected",
      };
      const response = await tradeApi.providerDisable(payload);
      if (response) {
        const payload2 = {
          token: storeSession.tradeApi.accessToken,
          providerId: provider.id,
          version: 2,
        };
        dispatch(setProvider(payload2));
        dispatch(showSuccessAlert("copyt.unfollow.alert.title", "copyt.unfollow.alert.body"));
        setStopCopyLoader(false);
      }
    } catch (e) {
      dispatch(showErrorAlert(e));
    }
  };

  const handleCopyModalClose = () => {
    showCopyModal(false);
  };

  const handleConnectModalClose = () => {
    showConnectModal(false);
  };

  const initFollowingFrom = () => {
    let found = [...exchangeConnections].find(
      (item) => item.internalId === provider.exchangeInternalId,
    );
    if (found) {
      setFollowingFrom(found);
    }
  };

  useEffect(initFollowingFrom, [exchangeConnections]);

  return (
    <Box
      alignItems="center"
      className="copyTraderButton"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
    >
      <ConfirmDialog
        confirmConfig={confirmConfig}
        executeActionCallback={stopCopying}
        setConfirmConfig={setConfirmConfig}
      />
      {provider.disable ? (
        <CustomButton className="submitButton" onClick={startCopying}>
          <FormattedMessage id="copyt.copythistrader" />
        </CustomButton>
      ) : provider.exchangeInternalId ? (
        provider.exchangeInternalId === storeSettings.selectedExchange.internalId ? (
          <CustomButton className="loadMoreButton" loading={stopCopyLoader} onClick={confirmAction}>
            <FormattedMessage id="copyt.stopcopyingtrader" />
          </CustomButton>
        ) : (
          <Box
            alignItems="center"
            className="actionHelpBox"
            display="flex"
            flexDirection="row"
            justifyContent="flex-start"
          >
            <Typography variant="h4">
              <FormattedMessage id="copyt.followingfrom" />
            </Typography>
            <Tooltip placement="top" title={followingFrom.internalName}>
              <Box>
                <ExchangeIcon exchange={followingFrom.name.toLowerCase()} size="mediumLarge" />
              </Box>
            </Tooltip>
          </Box>
        )
      ) : (
        <CustomButton className="loadMoreButton" loading={stopCopyLoader} onClick={confirmAction}>
          <FormattedMessage id="copyt.stopcopyingtrader" />
        </CustomButton>
      )}
      <Modal onClose={handleCopyModalClose} persist={false} size="small" state={copyModal}>
        <CopyTraderForm onClose={handleCopyModalClose} provider={provider} />
      </Modal>
      <Modal onClose={handleConnectModalClose} size="small" state={connectModal}>
        <ConnectExchange onClose={handleConnectModalClose} />
      </Modal>
    </Box>
  );
};

export default CopyTraderButton;
