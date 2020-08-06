import React from "react";
import "./ExchangeIcon.scss";
import BinanceIcon from "../../images/exchanges/binance.svg";
import ZignalyIcon from "../../images/exchanges/zignaly.png";
import KucoinIcon from "../../images/exchanges/kucoin.svg";

/**
 * @typedef {Object} ExchangeIconPropTypes
 * @property {string} exchange Exchange name.
 * @property {String} [size] Icon size.
 * @property {String} [className] className
 * @property {React.MouseEventHandler} [onClick] onClick
 */

/**
 * Provides exchange icon.
 *
 * @param {ExchangeIconPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const ExchangeIcon = (props) => {
  const { exchange, size, onClick, className } = props;
  let icon = null;

  switch (exchange.toLowerCase()) {
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

  if (!exchange) return null;
  return (
    <img
      alt="zignaly"
      className={`exchangeIcon ${exchange} ${size ? size : ""} ${className ? className : ""}`}
      onClick={onClick}
      src={icon}
      title={exchange}
    />
  );
};
export default ExchangeIcon;
