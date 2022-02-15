import ETHIcon from "images/wallet/eth.svg";
import BSCIcon from "images/wallet/bsc.svg";
import BTCIcon from "images/coins/btc.svg";
import MATICIcon from "images/coins/matic.svg";
import SOLIcon from "images/wallet/sol.svg";
import TRXIcon from "images/wallet/trx.svg";

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
    case "SOL":
      return SOLIcon;
    case "TRX":
      return TRXIcon;
    default:
      return ETHIcon;
  }
};
