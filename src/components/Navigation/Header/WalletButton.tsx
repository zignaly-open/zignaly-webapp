import React, { useContext } from "react";
import styled from "styled-components";
import CustomButton from "components/CustomButton";
import PrivateAreaContext from "context/PrivateAreaContext";
import { Box, Tooltip, Typography } from "@material-ui/core";
import ZigCoinIcon from "images/wallet/zignaly-coin.svg";
import { isMobile } from "styles/styles";

const Button = styled(CustomButton)`
  min-width: 80px;
`;

const TypographyBalance = styled(Typography)`
  font-weight: 600;
  font-size: 18px;
`;

const ZIG = styled.span`
  color: ${(props) => props.theme.palette.text.secondary};
  font-weight: 600;
  font-size: 18px;
  margin-left: 4px;
`;

const WalletIcon = styled.img.attrs((props) => ({
  src: ZigCoinIcon,
}))`
  width: 40px;
  height: 40px;

  ${isMobile(`
    width: 32px;
    height: 32px;
  `)}

  ::placeholder {
    color: palevioletred;
  }
`;

const WalletButton = () => {
  const { walletBalance } = useContext(PrivateAreaContext);

  return (
    <Box display="flex" alignItems="center">
      <WalletIcon />
      <Button href="#wallet">
        <TypographyBalance>
          {walletBalance ? walletBalance.ZIG?.total || 0 : "-"}
          <ZIG>ZIG</ZIG>
        </TypographyBalance>
      </Button>
    </Box>
  );
};
export default WalletButton;
