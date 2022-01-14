import ETHIcon from "images/wallet/eth.svg";
import BSCIcon from "images/wallet/bsc.svg";
import BTCIcon from "images/coins/btc.svg";
import MATICIcon from "images/coins/matic.svg";

export const getChainIcon = (chain: string) => {
  switch (chain.toUpperCase()) {
    case "BSC":
    case "BEP20 (BSC)":
    case "BEP20 (BINANCE SMART CHAIN)":
    case "BEP2 (BINANCE CHAIN)":
    case "BNB":
      return BSCIcon;
    case "BITCOIN":
    case "BTC":
      return BTCIcon;
    case "MATIC":
      return MATICIcon;
    default:
      return ETHIcon;
  }
};
