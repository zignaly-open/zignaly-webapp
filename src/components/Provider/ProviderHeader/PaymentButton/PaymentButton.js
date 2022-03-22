import React, { useState } from "react";
import "./PaymentButton.scss";
import { Box } from "@mui/material";
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
      <Modal onClose={() => showModal(false)} persist={false} size="small" state={modal}>
        <Disclaimer onClose={() => showModal(false)} provider={provider} />
      </Modal>
      <input
        alt="Buy Now with CoinPayments.net"
        onClick={() => showModal(true)}
        src="https://www.coinpayments.net/images/pub/buynow-grey.png"
        type="image"
      />
    </Box>
  );
};

export default PaymentButton;
