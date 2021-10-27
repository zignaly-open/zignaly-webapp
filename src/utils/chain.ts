import ETHIcon from "images/wallet/eth.svg";
import BSCIcon from "images/wallet/bsc.svg";

export const getChainIcon = (chain: string) => {
  switch (chain) {
    case "BSC":
      return BSCIcon;
    default:
      return ETHIcon;
  }
};
