import React from "react";
import BinanceIcon from "../../images/exchanges/binance.svg";
import ZignalyIcon from "../../images/exchanges/zignaly.svg";

/**
 * @typedef {Object} ExchangeIconPropTypes
 * @property {string} exchange Exchange name.
 */

/**
 * Provides exchange icon.
 *
 * @param {ExchangeIconPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const ExchangeIcon = (props) => {
  const { exchange } = props;
  let icon = null;
  switch (exchange) {
    case "binance":
      icon = BinanceIcon;
      break;
    case "zignaly":
      icon = ZignalyIcon;
      break;
    default:
      break;
  }
  return <img alt="zignaly" className="icon" src={icon} title={exchange} />;
};
export default ExchangeIcon;
