import React, { useState } from "react";
import "./CopyTraderButton.scss";
import { Box, Typography, Tooltip } from "@material-ui/core";
import CustomButton from "../../../CustomButton";
import { FormattedMessage } from "react-intl";
import Modal from "../../../Modal";
import CopyTraderForm from "../../../Forms/CopyTraderForm";
import useStoreSettingsSelector from "../../../../hooks/useStoreSettingsSelector";
import ExchangeIcon from "../../../ExchangeIcon";
import { useStoreUserExchangeConnections } from "../../../../hooks/useStoreUserSelector";
import ConnectExchange from "../../../Modal/ConnectExchange";
import StopCopyingTraderForm from "../../../Forms/StopCopyingTraderForm";

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
  const { selectedExchange } = useStoreSettingsSelector();
  const exchangeConnections = useStoreUserExchangeConnections();
  const [copyModal, showCopyModal] = useState(false);
  const [connectModal, showConnectModal] = useState(false);
  const [stopCopyingModal, showStopCopyingModal] = useState(false);
  const disabled = provider.disable;
  const sameSelectedExchange = provider.exchangeInternalId === selectedExchange.internalId;
  const followingFrom = exchangeConnections.find(
    (e) => e.internalId === provider.exchangeInternalId,
  );

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

  const handleConnectModalClose = () => {
    showConnectModal(false);
  };

  const handleStopCopyingModalClose = () => {
    showStopCopyingModal(false);
  };

  return (
    <Box
      alignItems="center"
      className="copyTraderButton"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
    >
      {disabled ? (
        <CustomButton className="submitButton" onClick={startCopying}>
          <FormattedMessage id="copyt.copythistrader" />
        </CustomButton>
      ) : !followingFrom || sameSelectedExchange ? (
        <CustomButton className="loadMoreButton" onClick={() => showStopCopyingModal(true)}>
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
        <CopyTraderForm onClose={handleCopyModalClose} provider={provider} />
      </Modal>
      <Modal onClose={handleConnectModalClose} size="small" state={connectModal}>
        <ConnectExchange onClose={handleConnectModalClose} />
      </Modal>
    </Box>
  );
};

export default CopyTraderButton;
