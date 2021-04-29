import React from "react";
import "./ConnectTraderForm .scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import { useIntl } from "react-intl";
import { Help } from "@material-ui/icons";
import { useStoreUserExchangeConnections } from "hooks/useStoreUserSelector";
import CopyTraderForm from "components/Forms/CopyTraderForm";
import CopyPSForm from "components/Forms/CopyPSForm";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 * @property {Function} onClose
 * @property {Function} onSuccess
 */

/**
 * Form wrapper to connect to a PS/CT service.
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ConnectTraderForm = ({ provider, onClose, onSuccess }) => {
  const { selectedExchange } = useStoreSettingsSelector();
  const intl = useIntl();
  const storeUserExchangeConnections = useStoreUserExchangeConnections();

  /**
   * @returns {String} Exchange name to display in the error.
   */
  const prepareExchangeName = () => {
    let name = "";
    for (let i = 0; i < provider.exchanges.length; i++) {
      if (provider.exchanges[i + 1]) {
        name += `${provider.exchanges[i]}/`;
      } else {
        name += `${provider.exchanges[i]}`;
      }
    }
    return name;
  };

  /**
   * Check if selected exchange is compatible with service.
   * @returns {string} Error message
   */
  const checkWrongExchange = () => {
    if (storeUserExchangeConnections.length > 0) {
      if (provider.profitSharing && selectedExchange.paperTrading) {
        return intl.formatMessage({ id: "copyt.copy.error4" });
      }
      if (provider.exchanges.length && provider.exchanges[0] !== "") {
        if (
          !provider.exchanges.includes(selectedExchange.name.toLowerCase()) ||
          provider.exchangeType.toLowerCase() !== selectedExchange.exchangeType.toLowerCase()
        ) {
          let exchangeName = prepareExchangeName();
          return intl.formatMessage(
            { id: "copyt.copy.error1" },
            {
              required: `${exchangeName.toUpperCase()} ${provider.exchangeType.toUpperCase()}`,
            },
          );
        }
      }
    } else {
      return intl.formatMessage({ id: "copyt.copy.error2" });
    }
    return "";
  };

  const wrongExchange = checkWrongExchange();

  const redirectToHelp = () => {
    const link =
      "https://help.zignaly.com/hc/en-us/articles/360019579879-I-have-an-error-of-incorrect-exchange-account-when-trying-to-connect-to-a-Profit-Sharing-service-";
    window.open(link, "_blank");
  };

  return (
    <Box className="connectTraderForm">
      {wrongExchange ? (
        <Box
          alignItems="flex-start"
          display="flex"
          flexDirection="column"
          className="wrongExchangeBox"
        >
          <Typography className="wrongExchangeTitle" variant="h3">
            <Box alignItems="center" component="span" display="flex" flexDirection="row">
              <FormattedMessage id="profitsharing.wrongexchange" />
              <Help className="helpIcon" onClick={redirectToHelp} />
            </Box>
          </Typography>
          <Typography>{wrongExchange}</Typography>
        </Box>
      ) : provider.profitSharing ? (
        <CopyPSForm onClose={onClose} onSuccess={onSuccess} provider={provider} />
      ) : (
        <CopyTraderForm onClose={onClose} onSuccess={onSuccess} provider={provider} />
      )}
    </Box>
  );
};

export default ConnectTraderForm;
