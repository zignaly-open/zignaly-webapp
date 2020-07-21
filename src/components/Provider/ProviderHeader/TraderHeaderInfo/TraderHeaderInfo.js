import React, { useState } from "react";
import "./TraderHeaderInfo.scss";
import { Box, Typography, Hidden, Grow } from "@material-ui/core";
import useStoreViewsSelector from "../../../../hooks/useStoreViewsSelector";
import { FormattedMessage } from "react-intl";
import ExchangeIcon from "../../../ExchangeIcon";
import EditIcon from "../../../../images/ct/edit.svg";
import Modal from "../../../Modal";
import CopyTraderForm from "../../../Forms/CopyTraderForm";
import { formatFloat } from "../../../../utils/format";
import PaymentButton from "../PaymentButton";
import TrialPeriod from "../TraderHeaderActions/TrialPeriod";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

/**
 * Provides the navigation bar for the dashboard.
 *
 * @returns {JSX.Element} Component JSX.
 */
const ProviderHeaderInfo = () => {
  const storeViews = useStoreViewsSelector();
  const [copyModal, showCopyModal] = useState(false);
  const [info, showInfo] = useState(true);

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
      flexWrap="wrap"
    >
      <Hidden smUp>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          className="infoActionBox"
          onClick={() => showInfo(!info)}
        >
          <Typography variant="h3">{info ? "Hide Info" : "More Info"}</Typography>
          {info ? (
            <ExpandLessIcon className="expandIcon" />
          ) : (
            <ExpandMoreIcon className="expandIcon" />
          )}
        </Box>
      </Hidden>
      {info && (
        <Grow in={info}>
          <Box
            className="infoDataBox"
            alignItems="center"
            display="flex"
            flexDirection="row"
            justifyContent="flex-start"
            flexWrap="wrap"
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
                {storeViews.provider.exchangeType
                  ? storeViews.provider.exchangeType.toUpperCase()
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
                <TrialPeriod provider={storeViews.provider} />
              )}
              {storeViews.provider.internalPaymentInfo && (
                <PaymentButton provider={storeViews.provider} />
              )}
            </Hidden>
            <Modal onClose={handleCopyModalClose} persist={false} size="small" state={copyModal}>
              <CopyTraderForm onClose={handleCopyModalClose} provider={storeViews.provider} />
            </Modal>
          </Box>
        </Grow>
      )}
    </Box>
  );
};

export default ProviderHeaderInfo;
