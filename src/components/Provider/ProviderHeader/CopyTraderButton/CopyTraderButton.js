import React, { useState } from "react";
import "./CopyTraderButton.scss";
import { Box, Typography, Tooltip } from "@material-ui/core";
import CustomButton from "../../../CustomButton";
import { FormattedMessage } from "react-intl";
import Modal from "../../../Modal";
import ConnectTraderForm from "../../../Forms/ConnectTraderForm";
import useSelectedExchange from "hooks/useSelectedExchange";
import ExchangeIcon from "../../../ExchangeIcon";
import { useStoreUserExchangeConnections } from "../../../../hooks/useStoreUserSelector";
import ConnectExchange from "../../../Modal/ConnectExchange";
import StopCopyingTraderForm from "../../../Forms/StopCopyingTraderForm";
import tradeApi from "../../../../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { getProvider } from "../../../../store/actions/views";
import { showErrorAlert, showSuccessAlert } from "../../../../store/actions/ui";
import { ConfirmDialog } from "../../../Dialogs";
import SuccessBox from "./SuccessBox";
import { isNil } from "lodash";
import { useTz } from "services/tz";

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
  const track = useTz();
  const selectedExchange = useSelectedExchange();
  const dispatch = useDispatch();
  const exchangeConnections = useStoreUserExchangeConnections();
  const [copyModal, showCopyModal] = useState(false);
  const [connectModal, showConnectModal] = useState(false);
  const [stopCopyingModal, showStopCopyingModal] = useState(false);
  const [copySuccessModal, showCopySuccessModal] = useState(false);
  const [cancelDisconnectLoader, showCancelDisconnectLoader] = useState(false);
  const { profitSharing } = provider;
  const disabled = provider.disable;
  const sameSelectedExchange = provider.exchangeInternalId === selectedExchange.internalId;
  const followingFrom =
    exchangeConnections &&
    exchangeConnections.find((e) => e.internalId === provider.exchangeInternalId);
  const exchangeData =
    provider.exchangeInternalIds &&
    provider.exchangeInternalIds.find((item) => item.internalId === selectedExchange.internalId);
  const disconnecting = exchangeData && exchangeData.disconnecting;

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

  const startCopying = () => {
    if (exchangeConnections.length) {
      track("copy-this-trader");
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
      providerId: provider.id,
      internalExchangeId: selectedExchange.internalId,
    };
    tradeApi
      .providerCancelDisconnect(payload)
      .then(() => {
        const providerPayload = {
          providerId: provider.id,
          exchangeInternalId: selectedExchange.internalId,
        };
        dispatch(getProvider(providerPayload, true));
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
      <>
        {!disconnecting ? (
          disabled ? (
            !provider.liquidated &&
            (isNil(provider.maxAllocatedBalance) ||
              provider.performance.totalBalance < provider.maxAllocatedBalance) &&
            profitSharing &&
            null
          ) : !profitSharing && !sameSelectedExchange ? (
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
          ) : (
            <CustomButton className="loadMoreButton" onClick={() => showStopCopyingModal(true)}>
              <FormattedMessage id="copyt.stopcopyingtrader" />
            </CustomButton>
          )
        ) : (
          !disabled && (
            <Tooltip
              placement="right"
              title={<FormattedMessage id="copyt.canceldisconnecting.tooltip" />}
            >
              <Box>
                <CustomButton
                  className="loadMoreButton"
                  loading={cancelDisconnectLoader}
                  onClick={confirmCancel}
                >
                  <FormattedMessage id="copyt.canceldisconnecting" />
                </CustomButton>
              </Box>
            </Tooltip>
          )
        )}
      </>
      <Modal
        onClose={handleStopCopyingModalClose}
        persist={false}
        size="small"
        state={stopCopyingModal}
      >
        <StopCopyingTraderForm onClose={handleStopCopyingModalClose} provider={provider} />
      </Modal>
      <Modal onClose={handleCopyModalClose} persist={false} size="small" state={copyModal}>
        <ConnectTraderForm
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
