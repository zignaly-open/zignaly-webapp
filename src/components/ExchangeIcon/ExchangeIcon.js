import React from "react";
import "./ExchangeIcon.scss";
import BinanceIcon from "../../images/exchanges/binance.svg";
import ZignalyIcon from "../../images/exchanges/zignaly.svg";
import KucoinIcon from "../../images/exchanges/kucoin.svg";

/**
 * @typedef {Object} ExchangeIconPropTypes
 * @property {string} exchange Exchange name.
 * @property {String} [size] Icon size.
 */

/**
 * Provides exchange icon.
 *
 * @param {ExchangeIconPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const ExchangeIcon = (props) => {
  const { exchange, size } = props;
  let icon = null;
  switch (exchange) {
    case "binance":
      icon = BinanceIcon;
      break;
    case "zignaly":
      icon = ZignalyIcon;
      break;
    case "kucoin":
      icon = KucoinIcon;
      break;
    default:
      break;
  }
  return (
    <img
      alt="zignaly"
      className={"exchangeIcon " + (size ? size : "")}
      src={icon}
      title={exchange}
    />
  );
};
export default ExchangeIcon;
