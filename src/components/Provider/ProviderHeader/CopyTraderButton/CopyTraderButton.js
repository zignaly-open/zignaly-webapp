import React, { useState } from "react";
import "./CopyTraderButton.scss";
import { Box } from "@material-ui/core";
import CustomButton from "../../../CustomButton";
import { FormattedMessage } from "react-intl";
import Modal from "../../../Modal";
import CopyTraderForm from "../../../Forms/CopyTraderForm";

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
  const [modal, showModal] = useState(false);

  const copyThisTrader = () => {
    showModal(true);
  };

  const stopCopying = () => {};

  const handleModalClose = () => {
    showModal(false);
  };

  return (
    <Box
      alignItems="center"
      className="copyTraderButton"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
    >
      {provider.exchangeInternalId && (
        <CustomButton className="loadMoreButton" onClick={stopCopying}>
          <FormattedMessage id="copyt.stopcopyingtrader" />
        </CustomButton>
      )}
      {!provider.exchangeInternalId && (
        <CustomButton className="submitButton" onClick={copyThisTrader}>
          <FormattedMessage id="copyt.copythistrader" />
        </CustomButton>
      )}
      <Modal state={modal} persist={false} size="small" onClose={handleModalClose}>
        <CopyTraderForm provider={provider} onClose={handleModalClose} />
      </Modal>
    </Box>
  );
};

export default CopyTraderButton;
