import React from "react";
import "./ExchangeIcon.scss";
import BinanceIcon from "../../images/exchanges/binance.svg";
import ZignalyIcon from "../../images/exchanges/zignaly.svg";
import KucoinIcon from "../../images/exchanges/kucoin.svg";
import BitmexIcon from "../../images/exchanges/bitmex.svg";
import VCCEIcon from "../../images/exchanges/vcce.png";
import AscendEXIcon from "../../images/exchanges/ascendex.png";

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
    case "bitmex":
      icon = BitmexIcon;
      break;
    case "zignaly":
      icon = ZignalyIcon;
      break;
    case "kucoin":
      icon = KucoinIcon;
      break;
    case "vcce":
      icon = VCCEIcon;
      break;
    case "ascendex":
      icon = AscendEXIcon;
      break;
    default:
      break;
  }

  if (!icon) return null;
  return (
    <img
      alt={exchange}
      className={`exchangeIcon ${exchange.toLowerCase()} ${size ? size : ""} ${
        className ? className : ""
      }`}
      onClick={onClick}
      src={icon}
      title={exchange}
    />
  );
};
export default ExchangeIcon;
