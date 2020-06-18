import React from "react";
import "./PaymentButton.scss";
import { Box } from "@material-ui/core";

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
  const ipnURL = "https://zignaly.com/api/cryptoPaymentListener.php";

  const createReturnSuccessUrl = () => {
    if (provider.isCopyTrading) {
      return `https://test.zignaly.com/app2/copyTraders/${provider.id}/profile#success`;
    } else {
      return `https://test.zignaly.com/app2/signalProviders/${provider.id}/profile#success`;
    }
  };

  const createReturnErrorUrl = () => {
    if (provider.isCopyTrading) {
      return `https://test.zignaly.com/app2/copyTraders/${provider.id}/profile#error`;
    } else {
      return `https://test.zignaly.com/app2/signalProviders/${provider.id}/profile#error`;
    }
  };

  const returnSuccessURL = createReturnSuccessUrl();

  const returnErrorURL = createReturnErrorUrl();

  return (
    <Box
      alignItems="center"
      className="paymentButton"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
    >
      {provider.id && (
        <Box>
          <form action="https://www.coinpayments.net/index.php" method="post">
            <input type="hidden" name="cmd" value="_pay" />
            <input type="hidden" name="reset" value="1" />
            <input type="hidden" name="merchant" value={provider.internalPaymentInfo.merchantId} />
            <input type="hidden" name="item_name" value="Zignaly Provider" />
            <input type="hidden" name="currency" value="USD" />
            <input type="hidden" name="amount" value={provider.internalPaymentInfo.price} />
            <input type="hidden" name="quantity" value="1" />
            <input type="hidden" name="allow_quantity" value="1" />
            <input type="hidden" name="want_shipping" value="0" />
            <input type="hidden" name="success_url" value={returnSuccessURL} />
            <input type="hidden" name="cancel_url" value={returnErrorURL} />
            <input type="hidden" name="allow_extra" value="0" />
            <input type="hidden" name="invoice" value={provider.id} />
            <input type="hidden" name="custom" value={provider.id} />
            <input type="hidden" name="ipn_url" value={ipnURL} />
            <input
              type="image"
              src="https://www.coinpayments.net/images/pub/checkout-grey.png"
              alt="Buy Now with CoinPayments.net"
            />
          </form>
        </Box>
      )}
    </Box>
  );
};

export default PaymentButton;
