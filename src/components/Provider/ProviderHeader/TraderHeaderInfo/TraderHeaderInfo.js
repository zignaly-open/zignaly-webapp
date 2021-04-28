import React, { useState } from "react";
import "./TraderHeaderInfo.scss";
import { Box, Typography, Hidden, Tooltip } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import ExchangeIcon from "../../../ExchangeIcon";
import EditIcon from "../../../../images/ct/edit.svg";
import Modal from "../../../Modal";
import CopyTraderForm from "../../../Forms/CopyTraderForm";
import { formatFloat } from "../../../../utils/format";
import PaymentButton from "../PaymentButton";
import TrialPeriod from "../TraderHeaderActions/TrialPeriod";
import BaseCurrency from "../BaseCurrency";
import useStoreSettingsSelector from "hooks/useStoreSettingsSelector";
import SuccessBox from "../CopyTraderButton/SuccessBox";
import CopyPSForm from "../../../Forms/CopyPSForm";

/**
 * @typedef {import('../../../../services/tradeApiClient.types').DefaultProviderGetObject} DefaultProviderGetObject
 * @typedef {Object} DefaultProps
 * @property {DefaultProviderGetObject} provider
 */

/**
 * Trader Header Info compoennt for CT profile.
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} JSX Element JSX.
 */
const TraderHeaderInfo = ({ provider }) => {
  const { selectedExchange } = useStoreSettingsSelector();
  const [copyModal, showCopyModal] = useState(false);
  const [copySuccessModal, showCopySuccessModal] = useState(false);
  const sameSelectedExchange = provider.exchangeInternalId === selectedExchange.internalId;
  const selectedExchangeProviderData = provider.exchangeInternalIds
    ? provider.exchangeInternalIds.find((item) => item.internalId === selectedExchange.internalId)
    : undefined;
  const profitsMode = selectedExchangeProviderData ? selectedExchangeProviderData.profitsMode : "";

  const handleCopyModalClose = () => {
    showCopyModal(false);
  };

  const handleCopySuccessModalOpen = () => {
    showCopySuccessModal(true);
  };

  const handleCopySuccessModalClose = () => {
    showCopySuccessModal(false);
  };

  return (
    <Box
      alignItems="center"
      className="providerHeaderInfo"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
    >
      <Typography className="base" variant="h4">
        <span>
          {provider.isCopyTrading ? (
            <FormattedMessage id="srv.basecurrency" />
          ) : (
            <FormattedMessage id="srv.edit.quotes" />
          )}
        </span>
        <BaseCurrency provider={provider} />
      </Typography>

      <Typography className="trade" variant="h4">
        <span>
          <FormattedMessage id="copyt.trading" />
        </span>
        <Box className="imageBox">
          {provider.exchanges.map((item, index) => (
            <ExchangeIcon exchange={item} key={index} size="small" />
          ))}
        </Box>
      </Typography>

      <Typography className="type" variant="h4">
        <span>
          <FormattedMessage id="accounts.exchange.type" />
        </span>
        <b>{provider.exchangeType ? provider.exchangeType.toUpperCase() : ""}</b>
      </Typography>

      <Typography className="copiers" variant="h4">
        <span>
          {provider.isCopyTrading ? (
            <FormattedMessage id="copyt.copiers" />
          ) : (
            <FormattedMessage id="srv.followers" />
          )}
        </span>
        <b>{provider.followers} </b>
      </Typography>

      {provider.profitSharing ? (
        <Tooltip
          placement="top"
          title={
            <FormattedMessage
              id="copyt.successfee.tootltip"
              values={{
                providerShare: provider.profitsShare,
                userShare: 100 - provider.profitsShare,
              }}
            />
          }
        >
          <Typography className="price" variant="h4">
            <span>
              <FormattedMessage id="copyt.successfee" />
            </span>
            <b>{`${provider.profitsShare}%`}</b>
          </Typography>
        </Tooltip>
      ) : (
        <Typography className="price" variant="h4">
          <span>
            <FormattedMessage id="srv.edit.price" />
          </span>
          <b>{`$${provider.price}/Month`}</b>
        </Typography>
      )}
      <Hidden smUp>
        {provider.profitSharing && provider.internalPaymentInfo && (
          <TrialPeriod provider={provider} />
        )}
      </Hidden>

      {provider.isCopyTrading && (
        <Typography className="allocated" variant="h4">
          {!provider.disable ? (
            <>
              <FormattedMessage id="srv.allocated" />
              <b>
                {formatFloat(provider.allocatedBalance)}{" "}
                {provider.copyTradingQuote ? provider.copyTradingQuote.toUpperCase() : ""}
              </b>
            </>
          ) : (
            !provider.profitSharing && (
              <>
                <FormattedMessage id="srv.minimum" />
                <b>
                  {formatFloat(provider.minAllocatedBalance)}{" "}
                  {provider.copyTradingQuote ? provider.copyTradingQuote.toUpperCase() : ""}
                </b>
              </>
            )
          )}
          {(sameSelectedExchange || selectedExchangeProviderData) && !provider.disable && (
            <img
              alt="zignaly"
              className="editIcon"
              onClick={() => showCopyModal(true)}
              src={EditIcon}
            />
          )}
        </Typography>
      )}

      {provider.isCopyTrading && (
        <Typography className="traderType" variant="h4">
          <span>
            <FormattedMessage id="accounts.exchange.type" />
          </span>
          <b>
            {provider.profitSharing ? (
              <FormattedMessage id="copyt.profitsharing" />
            ) : (
              <FormattedMessage id="copyt.copytrading" />
            )}
            {provider.profitSharing && profitsMode && ` / ${profitsMode}`}
          </b>
        </Typography>
      )}

      <Hidden smUp>
        {!provider.disable && !provider.profitSharing && provider.internalPaymentInfo && (
          <PaymentButton provider={provider} />
        )}
      </Hidden>
      <Modal onClose={handleCopyModalClose} persist={false} size="small" state={copyModal}>
        {provider.profitSharing ? (
          <CopyPSForm
            onClose={handleCopyModalClose}
            onSuccess={handleCopySuccessModalOpen}
            provider={provider}
          />
        ) : (
          <CopyTraderForm
            onClose={handleCopyModalClose}
            onSuccess={handleCopySuccessModalOpen}
            provider={provider}
          />
        )}
      </Modal>
      <Modal
        onClose={handleCopySuccessModalClose}
        persist={false}
        size="small"
        state={copySuccessModal}
      >
        <SuccessBox provider={provider} />
      </Modal>
    </Box>
  );
};

export default TraderHeaderInfo;
