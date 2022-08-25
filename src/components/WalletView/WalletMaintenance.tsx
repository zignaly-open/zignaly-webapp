import React from "react";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { Title } from "styles/styles";
import WalletIcon from "images/wallet/wallet.svg";

const WalletMaintenance = () => {
  return (
    <>
      <Title>
        <img src={WalletIcon} width={40} height={40} />
        <FormattedMessage id="wallet.zig" />
      </Title>
      <Box display="flex" flexDirection="column" alignItems="center" mt="138px">
        <Typography variant="h3" style={{ fontSize: "22px", textTransform: "uppercase" }}>
          Under Maintenance
        </Typography>
        <Typography
          variant="subtitle1"
          style={{
            marginTop: "26px",
            fontSize: "17px",
            textTransform: "none",
            textAlign: "center",
          }}
        >
          Zignaly Wallet is under maintenance and will be available again shortly.
          <br />
          Please, check again later.
        </Typography>
      </Box>
    </>
  );
};

export default WalletMaintenance;
