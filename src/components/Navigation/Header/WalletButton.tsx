import React, { useContext } from "react";
import styled from "styled-components";
import CustomButton from "components/CustomButton";
import PrivateAreaContext from "context/PrivateAreaContext";

const Button = styled(CustomButton)`
  min-width: 80px;
`;

const WalletButton = () => {
  const { walletBalance } = useContext(PrivateAreaContext);

  return <Button href="#wallet">{walletBalance ? walletBalance.ZIG || 0 : "-"} ZIG</Button>;
};
export default WalletButton;
