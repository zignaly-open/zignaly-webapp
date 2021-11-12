import ETHIcon from "images/wallet/eth.svg";
import BSCIcon from "images/wallet/bsc.svg";
import BTCIcon from "images/coin/btc.svg";

export const getChainIcon = (chain: string) => {
  switch (chain) {
    case "BSC":
    case "BEP20 (BSC)":
      return BSCIcon;
    case "Bitcoin":
    case "BTC":
      return BTCIcon;
    default:
      return ETHIcon;
  }
};
