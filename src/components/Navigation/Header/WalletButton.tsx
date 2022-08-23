import React, { useContext } from "react";
import styled from "styled-components";
import CustomButton from "components/CustomButton";
import PrivateAreaContext from "context/PrivateAreaContext";
import { Box, Tooltip, Typography } from "@material-ui/core";
import ZigCoinIcon from "images/wallet/zignaly-coin.svg";
import { isMobile } from "styles/styles";
import NumberFormat from "react-number-format";

const Button = styled(CustomButton)`
  min-width: 80px;
`;

const TypographyBalance = styled(Typography)`
  font-weight: 600;
  font-size: 18px;
`;

const ZIG = styled.span`
  color: ${(props) => props.theme.newTheme.purple};
  font-weight: 600;
  font-size: 18px;
  margin-left: 4px;
`;

const WalletIcon = styled.img.attrs((props) => ({
  src: ZigCoinIcon,
}))`
  width: 40px;
  height: 40px;
  margin-right: 12px;

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
      <Button href="#wallet" id="zig-wallet">
        <WalletIcon />
        <TypographyBalance>
          {walletBalance ? (
            <NumberFormat
              value={walletBalance.ZIG?.balance || 0}
              thousandSeparator={true}
              displayType="text"
            />
          ) : (
            <>-</>
          )}
          <ZIG>ZIG</ZIG>
        </TypographyBalance>
      </Button>
    </Box>
  );
};
export default WalletButton;
