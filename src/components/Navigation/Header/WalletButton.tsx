import React, { useContext } from "react";
import styled from "styled-components";
import CustomButton from "components/CustomButton";
import PrivateAreaContext from "context/PrivateAreaContext";
import { Box, Tooltip, Typography } from "@material-ui/core";
import ZigCoinIcon from "images/wallet/zignaly-coin.svg";

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

const WalletButton = () => {
  const { walletBalance } = useContext(PrivateAreaContext);

  return (
    <Box display="flex" alignItems="center">
      <img height={40} src={ZigCoinIcon} width={40} />
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
