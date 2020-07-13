import React, { useState } from "react";
import "./PaymentButton.scss";
import { Box } from "@material-ui/core";
import Modal from "../../../Modal";
import Disclaimer from "../../Profile/Disclaimer";

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
const PaymentButton = ({ provider }) => {
  const [modal, showModal] = useState(false);

  return (
    <Box
      alignItems="center"
      className="paymentButton"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
    >
      <Modal state={modal} persist={false} size="small" onClose={() => showModal(false)}>
        <Disclaimer provider={provider} onClose={() => showModal(false)} />
      </Modal>
      <input
        alt="Buy Now with CoinPayments.net"
        src="https://www.coinpayments.net/images/pub/buynow-grey.png"
        type="image"
        onClick={() => showModal(true)}
      />
    </Box>
  );
};

export default PaymentButton;
