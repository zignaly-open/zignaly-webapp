import React, { useState } from "react";
import "./CopyTraderButton.scss";
import { Box } from "@material-ui/core";
import CustomButton from "../../../CustomButton";
import { FormattedMessage } from "react-intl";
import Modal from "../../../Modal";
import { ConfirmDialog } from "../../../Dialogs";
import CopyTraderForm from "../../../Forms/CopyTraderForm";
import tradeApi from "../../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import useStoreSettingsSelector from "../../../../hooks/useStoreSettingsSelector";
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
  const storeSettings = useStoreSettingsSelector();
  const dispatch = useDispatch();
  const [copyModal, showCopyModal] = useState(false);
  const [stopCopyLoader, setStopCopyLoader] = useState(false);
  const initConfirmConfig = {
    titleTranslationId: "",
    messageTranslationId: "",
    visible: false,
  };

  const [confirmConfig, setConfirmConfig] = useState(initConfirmConfig);

  const copyThisTrader = () => {
    showCopyModal(true);
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
      console.log(response);
      if (response) {
        const payload2 = {
          token: storeSession.tradeApi.accessToken,
          providerId: provider.id,
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
      {provider.exchangeInternalId && (
        <CustomButton className="loadMoreButton" onClick={stopCopying} loading={stopCopyLoader}>
          <FormattedMessage id="copyt.stopcopyingtrader" />
        </CustomButton>
      )}
      {!provider.exchangeInternalId && (
        <CustomButton className="submitButton" onClick={copyThisTrader}>
          <FormattedMessage id="copyt.copythistrader" />
        </CustomButton>
      )}
      <Modal state={copyModal} persist={false} size="small" onClose={handleCopyModalClose}>
        <CopyTraderForm provider={provider} onClose={handleCopyModalClose} />
      </Modal>
      <ConfirmDialog
        confirmConfig={confirmConfig}
        executeActionCallback={stopCopying}
        setConfirmConfig={setConfirmConfig}
      />
    </Box>
  );
};

export default CopyTraderButton;
