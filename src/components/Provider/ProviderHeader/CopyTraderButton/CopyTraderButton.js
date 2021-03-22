import React, { useState, useEffect } from "react";
import "./CopyTraderButton.scss";
import { Box, Typography, Tooltip } from "@material-ui/core";
import CustomButton from "../../../CustomButton";
import { FormattedMessage } from "react-intl";
import Modal from "../../../Modal";
import CopyTraderForm from "../../../Forms/CopyTraderForm";
import useStoreSettingsSelector from "../../../../hooks/useStoreSettingsSelector";
import ExchangeIcon from "../../../ExchangeIcon";
import {
  useStoreUserData,
  useStoreUserExchangeConnections,
} from "../../../../hooks/useStoreUserSelector";
import ConnectExchange from "../../../Modal/ConnectExchange";
import StopCopyingTraderForm from "../../../Forms/StopCopyingTraderForm";
import tradeApi from "../../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { setProvider } from "../../../../store/actions/views";
import { showErrorAlert, showSuccessAlert } from "../../../../store/actions/ui";
import { ConfirmDialog } from "../../../Dialogs";
import SuccessBox from "./SuccessBox";

/**
 * @typedef {Object} DefaultProps
 * @property {import('services/tradeApiClient.types').DefaultProviderGetObject} provider
 */
/**
 * Button to copy a service provider.
 *
 * @param {DefaultProps} props Default props
 * @returns {JSX.Element} Component JSX.
 */
const CopyTraderButton = ({ provider }) => {
  const { selectedExchange } = useStoreSettingsSelector();
  const storeSession = useStoreSessionSelector();
  const userData = useStoreUserData();
  const dispatch = useDispatch();
  const exchangeConnections = useStoreUserExchangeConnections();
  const [copyModal, showCopyModal] = useState(false);
  const [connectModal, showConnectModal] = useState(false);
  const [stopCopyingModal, showStopCopyingModal] = useState(false);
  const [copySuccessModal, showCopySuccessModal] = useState(false);
  const [positions, setPositions] = useState(null);
  const [cancelDisconnectLoader, showCancelDisconnectLoader] = useState(false);
  const disabled = provider.disable;
  const { profitSharing } = provider;
  const sameSelectedExchange = provider.exchangeInternalId === selectedExchange.internalId;
  const followingFrom =
    exchangeConnections &&
    exchangeConnections.find((e) => e.internalId === provider.exchangeInternalId);
  const disconnectedExchangeData = provider.exchangeInternalIds
    ? provider.exchangeInternalIds.find((item) => item.internalId === selectedExchange.internalId)
    : undefined;
  const disconnecting =
    disconnectedExchangeData && disconnectedExchangeData.disconnecting
      ? disconnectedExchangeData.disconnecting
      : false;

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

  const confirmCancel = () => {
    setConfirmConfig({
      titleTranslationId: "copyt.canceldisconnect.title",
      messageTranslationId: "copyt.canceldisconnect.body",
      visible: true,
    });
  };

  const loadPositions = () => {
    if (provider.id && provider.profitSharing && provider.isAdmin && !provider.disable) {
      const payload = {
        token: storeSession.tradeApi.accessToken,
        providerId: provider.id,
      };
      tradeApi
        .providerOpenPositions(payload)
        .then((response) => {
          setPositions(response);
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        });
    }
  };

  useEffect(loadPositions, [provider.id]);

  const startCopying = () => {
    if (exchangeConnections.length) {
      showCopyModal(true);
    } else {
      showConnectModal(true);
    }
  };

  const handleCopyModalClose = () => {
    showCopyModal(false);
  };

  const handleCopySuccessModalOpen = () => {
    showCopySuccessModal(true);
  };

  const handleCopySuccessModalClose = () => {
    showCopySuccessModal(false);
  };

  const handleConnectModalClose = () => {
    showConnectModal(false);
  };

  const handleStopCopyingModalClose = () => {
    showStopCopyingModal(false);
  };

  const cancelDisconnect = () => {
    showCancelDisconnectLoader(true);
    const payload = {
      token: storeSession.tradeApi.accessToken,
      providerId: provider.id,
      internalExchangeId: selectedExchange.internalId,
    };
    tradeApi
      .providerCancelDisconnect(payload)
      .then(() => {
        const providerPayload = {
          token: storeSession.tradeApi.accessToken,
          providerId: provider.id,
          version: 2,
          exchangeInternalId: selectedExchange.internalId,
        };
        dispatch(setProvider(providerPayload, true));
        dispatch(
          showSuccessAlert("srv.canceldisconnect.alert.title", "srv.canceldisconnect.alert.body"),
        );
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        showCancelDisconnectLoader(false);
      });
  };

  const getPSButtonTooltip = () => {
    if (!PSCanBeDisconnected()) {
      return (
        <Typography variant="body1">
          <FormattedMessage id="copyt.stopcopyingtrader.tooltip" />
        </Typography>
      );
    }
  };

  const PSCanBeDisconnected = () => {
    return !provider.isAdmin || (provider.followers <= 1 && positions && positions.length === 0);
  };

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
        executeActionCallback={cancelDisconnect}
        setConfirmConfig={setConfirmConfig}
      />
      {profitSharing ? (
        <>
          {!disconnecting ? (
            disabled ? (
              <CustomButton className="submitButton" onClick={startCopying}>
                <FormattedMessage id="copyt.copythistrader" />
              </CustomButton>
            ) : (
              <Tooltip placement="top" title={getPSButtonTooltip()}>
                <span>
                  <CustomButton
                    className="loadMoreButton"
                    disabled={!PSCanBeDisconnected()}
                    onClick={() => showStopCopyingModal(true)}
                  >
                    <FormattedMessage id="copyt.stopcopyingtrader" />
                  </CustomButton>
                </span>
              </Tooltip>
            )
          ) : (
            !disabled && (
              <CustomButton
                className="loadMoreButton"
                loading={cancelDisconnectLoader}
                onClick={confirmCancel}
              >
                <FormattedMessage id="copyt.canceldisconnecting" />
              </CustomButton>
            )
          )}
        </>
      ) : (
        <>
          {disabled ? (
            <CustomButton className="submitButton" onClick={startCopying}>
              <FormattedMessage id="copyt.copythistrader" />
            </CustomButton>
          ) : (
            <>
              <CustomButton className="loadMoreButton" onClick={() => showStopCopyingModal(true)}>
                <FormattedMessage id="copyt.stopcopyingtrader" />
              </CustomButton>
              {!sameSelectedExchange && (
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
                  <Tooltip placement="top" title={followingFrom ? followingFrom.internalName : ""}>
                    <Box>
                      <ExchangeIcon
                        exchange={followingFrom ? followingFrom.name.toLowerCase() : ""}
                        size="mediumLarge"
                      />
                    </Box>
                  </Tooltip>
                </Box>
              )}
            </>
          )}
        </>
      )}
      <Modal
        onClose={handleStopCopyingModalClose}
        persist={false}
        size="small"
        state={stopCopyingModal}
      >
        <StopCopyingTraderForm onClose={handleStopCopyingModalClose} provider={provider} />
      </Modal>
      <Modal onClose={handleCopyModalClose} persist={false} size="small" state={copyModal}>
        <CopyTraderForm
          onClose={handleCopyModalClose}
          onSuccess={handleCopySuccessModalOpen}
          provider={provider}
        />
      </Modal>
      <Modal
        onClose={handleCopySuccessModalClose}
        persist={false}
        size="small"
        state={copySuccessModal}
      >
        <SuccessBox provider={provider} />
      </Modal>
      <Modal onClose={handleConnectModalClose} size="small" state={connectModal}>
        <ConnectExchange onClose={handleConnectModalClose} />
      </Modal>
    </Box>
  );
};

export default CopyTraderButton;
