import React, { useState } from "react";
import "./TraderHeaderInfo.scss";
import { Box, Typography, Hidden } from "@material-ui/core";
import useStoreViewsSelector from "../../../../hooks/useStoreViewsSelector";
import { FormattedMessage } from "react-intl";
import ExchangeIcon from "../../../ExchangeIcon";
import EditIcon from "../../../../images/ct/edit.svg";
import Modal from "../../../Modal";
import CopyTraderForm from "../../../Forms/CopyTraderForm";
import { formatFloat } from "../../../../utils/format";
import PaymentButton from "../PaymentButton";
import TrialPeriod from "../TraderHeaderActions/TrialPeriod";

/**
 * Provides the navigation bar for the dashboard.
 *
 * @returns {JSX.Element} Component JSX.
 */
const TraderHeaderInfo = () => {
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
      <Typography className="base" variant="h4">
        <span>
          <FormattedMessage id="srv.basecurrency" />
        </span>
        <b>
          {storeViews.provider.copyTradingQuote
            ? storeViews.provider.copyTradingQuote.toUpperCase()
            : ""}
        </b>
      </Typography>

      <Typography className="trade" variant="h4">
        <span>
          <FormattedMessage id="copyt.trading" />
        </span>
        <Box className="imageBox">
          {storeViews.provider.exchanges.map((item, index) => (
            <ExchangeIcon exchange={item} key={index} size="small" />
          ))}
        </Box>
      </Typography>

      <Typography className="type" variant="h4">
        <span>
          <FormattedMessage id="accounts.exchange.type" />
        </span>
        <b>
          {storeViews.provider.exchangeType ? storeViews.provider.exchangeType.toUpperCase() : ""}
        </b>
      </Typography>

      <Typography className="copiers" variant="h4">
        <span>
          <FormattedMessage id="copyt.copiers" />
        </span>
        <b>{storeViews.provider.followers} </b>
      </Typography>

      <Typography className="price" variant="h4">
        <span>
          <FormattedMessage id="srv.edit.price" />
        </span>
        <b>{`$${storeViews.provider.price}/Month`}</b>
      </Typography>
      <Hidden smUp>
        {storeViews.provider.internalPaymentInfo && <TrialPeriod provider={storeViews.provider} />}
      </Hidden>
      <Typography className="allocated" variant="h4">
        {storeViews.provider.exchangeInternalId && !storeViews.provider.disable ? (
          <>
            <FormattedMessage id="srv.allocated" />
            <b>
              {formatFloat(storeViews.provider.allocatedBalance)}{" "}
              {storeViews.provider.copyTradingQuote
                ? storeViews.provider.copyTradingQuote.toUpperCase()
                : ""}
            </b>
          </>
        ) : (
          <>
            <FormattedMessage id="srv.minimum" />
            <b>
              {formatFloat(storeViews.provider.minAllocatedBalance)}{" "}
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
      <Hidden smUp>
        {storeViews.provider.internalPaymentInfo && (
          <PaymentButton provider={storeViews.provider} />
        )}
      </Hidden>
      <Modal onClose={handleCopyModalClose} persist={false} size="small" state={copyModal}>
        <CopyTraderForm onClose={handleCopyModalClose} provider={storeViews.provider} />
      </Modal>
    </Box>
  );
};

export default TraderHeaderInfo;
