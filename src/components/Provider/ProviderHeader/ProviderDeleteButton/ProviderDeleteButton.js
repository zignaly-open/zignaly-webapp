import React, { useState } from "react";
import "./ProviderDeleteButton.scss";
import { Box, Tooltip, Typography } from "@material-ui/core";
import CustomButton from "../../../CustomButton";
import { FormattedMessage } from "react-intl";
import tradeApi from "../../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import { navigate } from "gatsby";
import { useDispatch } from "react-redux";
import { showErrorAlert, showSuccessAlert } from "../../../../store/actions/ui";
import { ConfirmDialog } from "../../../Dialogs";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 * @property {Boolean} [disabled]
 */
/**
 * Delete button component for clones.
 *
 * @param {DefaultProps} props Default props
 * @returns {JSX.Element} Component JSX.
 */
const ProviderDeleteButton = ({ provider, disabled }) => {
  const storeSession = useStoreSessionSelector();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

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

  const redirect = () => {
    if (provider.isCopyTrading) {
      navigate("/copyTraders");
    } else {
      navigate("/signalProviders");
    }
  };

  const deleteProvider = async () => {
    setLoading(true);
    const payload = {
      token: storeSession.tradeApi.accessToken,
      providerId: provider.id,
    };
    await tradeApi
      .providerDelete(payload)
      .then(() => {
        let alert = provider.isClone
          ? "srv.deleteclone.alert.body"
          : provider.isCopyTrading
          ? "srv.deletetrader.alert.body"
          : "srv.deleteprovider.alert.body";
        dispatch(showSuccessAlert("", alert));
        redirect();
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const confirmAction = () => {
    if (provider.isClone) {
      setConfirmConfig({
        titleTranslationId: "confirm.deleteclone.title",
        messageTranslationId: "confirm.deleteclone.message",
        visible: true,
      });
    }
    if (!provider.isClone && provider.isCopyTrading) {
      setConfirmConfig({
        titleTranslationId: "confirm.deletetrader.title",
        messageTranslationId: "confirm.deletetrader.message",
        visible: true,
      });
    }
    if (!provider.isClone && !provider.isCopyTrading) {
      setConfirmConfig({
        titleTranslationId: "confirm.deleteprovider.title",
        messageTranslationId: "confirm.deleteprovider.message",
        visible: true,
      });
    }
  };

  const getTooltip = () => {
    if (disabled) {
      if (provider.isCopyTrading && provider.profitSharing) {
        return (
          <Typography variant="body1">
            <FormattedMessage id="copyt.ps.deletedisabled.tooltip" />
          </Typography>
        );
      }
      if (provider.isCopyTrading && !provider.profitSharing) {
        return (
          <Box>
            <ul>
              <li>
                <FormattedMessage id="copyt.deletedisabled.tooltip.point.1" />
              </li>
              <li>
                <FormattedMessage id="copyt.deletedisabled.tooltip.point.2" />
              </li>
              <li>
                <FormattedMessage id="copyt.deletedisabled.tooltip.point.3" />
              </li>
            </ul>
          </Box>
        );
      }

      return (
        <Box>
          <ul>
            <li>
              <FormattedMessage id="srv.deletedisabled.tooltip.point.1" />
            </li>
            <li>
              <FormattedMessage id="srv.deletedisabled.tooltip.point.2" />
            </li>
          </ul>
        </Box>
      );
    }
    return "";
  };

  return (
    <Box
      alignItems="center"
      className="providerDeleteButton"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
    >
      <ConfirmDialog
        confirmConfig={confirmConfig}
        executeActionCallback={deleteProvider}
        setConfirmConfig={setConfirmConfig}
      />
      {provider.isClone && (
        <CustomButton className="deleteButton" loading={loading} onClick={confirmAction}>
          <FormattedMessage id="srv.deleteclone" />
        </CustomButton>
      )}

      {!provider.isClone && (
        <Tooltip placement="top" title={getTooltip()}>
          <span>
            <CustomButton
              className="deleteButton"
              disabled={!!disabled}
              loading={loading}
              onClick={confirmAction}
            >
              <FormattedMessage
                id={provider.isCopyTrading ? "srv.deletetrader" : "srv.deleteprovider"}
              />
            </CustomButton>
          </span>
        </Tooltip>
      )}
    </Box>
  );
};

export default ProviderDeleteButton;
