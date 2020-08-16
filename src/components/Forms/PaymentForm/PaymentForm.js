import React from "react";
import { useStoreUserData } from "../../../hooks/useStoreUserSelector";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 */

/**
 * Provides the navigation bar for the dashboard.
 *
 * @param {DefaultProps} props Default props
 * @returns {JSX.Element} Component JSX.
 */
const PaymentForm = ({ provider }) => {
  const storeUserData = useStoreUserData();
  const ipnURL = "https://zignaly.com/api/cryptoPaymentListener.php";
  const baseURL = process.env.GATSBY_BASE_APP_URL;

  const createReturnSuccessUrl = () => {
    if (provider.isCopyTrading) {
      return `${baseURL}/copyTraders/${provider.id}#success`;
    }
    return `${baseURL}/signalProviders/${provider.id}#success`;
  };

  const createReturnErrorUrl = () => {
    if (provider.isCopyTrading) {
      return `${baseURL}/copyTraders/${provider.id}#error`;
    }
    return `${baseURL}/signalProviders/${provider.id}#error`;
  };

  const returnSuccessURL = createReturnSuccessUrl();
  const returnErrorURL = createReturnErrorUrl();

  return (
    <form action="https://www.coinpayments.net/index.php" method="post">
      <input name="cmd" type="hidden" value="_pay" />
      <input name="reset" type="hidden" value="1" />
      <input name="merchant" type="hidden" value={provider.internalPaymentInfo.merchantId} />
      <input name="item_name" type="hidden" value="Zignaly Provider" />
      <input name="currency" type="hidden" value="USD" />
      <input name="amountf" type="hidden" value={provider.internalPaymentInfo.price} />
      <input name="quantity" type="hidden" value="1" />
      <input name="allow_quantity" type="hidden" value="1" />
      <input name="want_shipping" type="hidden" value="0" />
      <input name="success_url" type="hidden" value={returnSuccessURL} />
      <input name="cancel_url" type="hidden" value={returnErrorURL} />
      <input name="allow_extra" type="hidden" value="0" />
      <input name="invoice" type="hidden" value={provider.id} />
      <input name="custom" type="hidden" value={storeUserData.userId} />
      <input name="ipn_url" type="hidden" value={ipnURL} />
      <input
        alt="Buy Now with CoinPayments.net"
        src="https://www.coinpayments.net/images/pub/buynow-grey.png"
        type="image"
      />
    </form>
  );
};

export default PaymentForm;
