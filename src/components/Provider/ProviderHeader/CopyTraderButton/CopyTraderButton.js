import React, { useState } from "react";
import "./CopyTraderButton.scss";
import { Box } from "@material-ui/core";
import CustomButton from "../../../CustomButton";
import { FormattedMessage } from "react-intl";
import Modal from "../../../Modal";
import CopyTraderForm from "../../../Forms/CopyTraderForm";
import tradeApi from "../../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { setProvider } from "../../../../store/actions/views";

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
  const dispatch = useDispatch();
  const [copyModal, showCopyModal] = useState(false);
  const [stopCopyLoader, setStopCopyLoader] = useState(false);

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
        setStopCopyLoader(false);
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const handleCopyModalClose = () => {
    showCopyModal(false);
  };

  return (
    <Box
      alignItems="center"
      className="copyTraderButton"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
    >
      {provider.disable ? (
        <CustomButton className="submitButton" onClick={() => showCopyModal(true)}>
          <FormattedMessage id="copyt.copythistrader" />
        </CustomButton>
      ) : (
        <CustomButton className="loadMoreButton" loading={stopCopyLoader} onClick={stopCopying}>
          <FormattedMessage id="copyt.stopcopyingtrader" />
        </CustomButton>
      )}
      <Modal onClose={handleCopyModalClose} persist={false} size="small" state={copyModal}>
        <CopyTraderForm onClose={handleCopyModalClose} provider={provider} />
      </Modal>
    </Box>
  );
};

export default CopyTraderButton;
