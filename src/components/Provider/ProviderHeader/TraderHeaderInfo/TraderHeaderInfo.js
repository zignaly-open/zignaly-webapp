import React, { useState } from "react";
import "./TraderHeaderInfo.scss";
import { Box, Typography } from "@material-ui/core";
import useStoreViewsSelector from "../../../../hooks/useStoreViewsSelector";
import { FormattedMessage } from "react-intl";
import ExchangeIcon from "../../../ExchangeIcon";
import EditIcon from "../../../../images/ct/edit.svg";
import Modal from "../../../Modal";
import CopyTraderForm from "../../../Forms/CopyTraderForm";

/**
 * Provides the navigation bar for the dashboard.
 *
 * @returns {JSX.Element} Component JSX.
 */
const ProviderHeaderInfo = () => {
  const storeViews = useStoreViewsSelector();
  const [copyModal, showCopyModal] = useState(false);

  const handleCopyModalClose = () => {
    showCopyModal(false);
  };

  return (
    <Box
      alignItems="center"
      className="providerHeaderInfo"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
    >
      <Typography variant="h4">
        <FormattedMessage id="srv.basecurrency" />
        <b>
          {storeViews.provider.copyTradingQuote
            ? storeViews.provider.copyTradingQuote.toUpperCase()
            : ""}
        </b>
      </Typography>

      <Typography variant="h4">
        <FormattedMessage id="copyt.trading" />
        <Box className="imageBox">
          {storeViews.provider.exchanges.map((item, index) => (
            <ExchangeIcon exchange={item} key={index} size="small" />
          ))}
        </Box>
      </Typography>

      <Typography variant="h4">
        <FormattedMessage id="accounts.exchange.type" />
        <b>
          {storeViews.provider.copyTradingQuote
            ? storeViews.provider.copyTradingQuote.toUpperCase()
            : ""}
        </b>
      </Typography>

      <Typography variant="h4">
        <FormattedMessage id="copyt.copiers" />
        <b>{storeViews.provider.followers} </b>
      </Typography>

      <Typography variant="h4">
        <FormattedMessage id="srv.edit.price" />
        <b>{`$${storeViews.provider.price}/Month`}</b>
      </Typography>
      <Typography variant="h4">
        {storeViews.provider.exchangeInternalId && !storeViews.provider.disable ? (
          <>
            <FormattedMessage id="srv.allocated" />
            <b>
              {storeViews.provider.allocatedBalance}{" "}
              {storeViews.provider.copyTradingQuote
                ? storeViews.provider.copyTradingQuote.toUpperCase()
                : ""}
            </b>
          </>
        ) : (
          <>
            <FormattedMessage id="srv.minimum" />
            <b>
              {storeViews.provider.minAllocatedBalance}{" "}
              {storeViews.provider.copyTradingQuote
                ? storeViews.provider.copyTradingQuote.toUpperCase()
                : ""}
            </b>
          </>
        )}
        {storeViews.provider.exchangeInternalId && !storeViews.provider.disable && (
          <img
            alt="zignaly"
            className="editIcon"
            onClick={() => showCopyModal(true)}
            src={EditIcon}
          />
        )}
      </Typography>
      <Modal onClose={handleCopyModalClose} persist={false} size="small" state={copyModal}>
        <CopyTraderForm onClose={handleCopyModalClose} provider={storeViews.provider} />
      </Modal>
    </Box>
  );
};

export default ProviderHeaderInfo;
