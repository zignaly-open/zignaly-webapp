import ETHIcon from "public/images/wallet/eth.svg";
import BSCIcon from "public/images/wallet/bsc.svg";
import BTCIcon from "public/images/coins/btc.svg";
import MATICIcon from "public/images/coins/matic.svg";
import SOLIcon from "public/images/wallet/sol.svg";
import TRXIcon from "public/images/wallet/trx.svg";
import AVAXIcon from "public/images/coins/avax.svg";

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
    case "SOLANA":
      return SOLIcon;
    case "TRX":
      return TRXIcon;
    case "AVAX":
    case "AVAXC":
      return AVAXIcon;
    default:
      return ETHIcon;
  }
};
