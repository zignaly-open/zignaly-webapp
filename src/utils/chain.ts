import ETHIcon from "images/wallet/eth.svg";
import BSCIcon from "images/wallet/bsc.svg";
import BTCIcon from "images/coins/btc.svg";

export const getChainIcon = (chain: string) => {
  switch (chain.toUpperCase()) {
    case "BSC":
    case "BEP20 (BSC)":
    case "BEP20 (Binance Smart Chain)":
      return BSCIcon;
    case "BITCOIN":
    case "BTC":
      return BTCIcon;
    default:
      return ETHIcon;
  }
};
