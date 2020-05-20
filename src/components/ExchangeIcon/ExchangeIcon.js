import React from "react";
import { Icon } from "@material-ui/core";
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
  return (
    <Icon>
      <img alt="zignaly" className="icon" src={icon} />
    </Icon>
  );
};
export default ExchangeIcon;
