import React from "react";
import QRCode from "qrcode.react";
import { Box, Typography } from "@mui/material";
import "./DepositQRCodes.scss";
import { FormattedMessage } from "react-intl";
/**
 * @typedef {import("../../../../../services/tradeApiClient.types").ExchangeDepositAddress} ExchangeDepositAddress
 */
/**
 * @typedef {Object} TipBoxPropTypes
 * @property {ExchangeDepositAddress} address address object.
 */

/**
 * Provides address QR codes.
 *
 * @param {TipBoxPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const DepositQRCodes = ({ address }) => {
  return (
    <Box
      alignItems="center"
      className="depositQRCodes"
      display="flex"
      flex={1}
      flexDirection="row"
      justifyContent="center"
    >
      <Box className="qrCode">
        <Typography variant="body1">
          {address.currency} <FormattedMessage id="deposit.address" />
        </Typography>
        <QRCode value={address.address} />
      </Box>

      {address.tag && (
        <Box className="qrCode">
          <Typography variant="body1">
            {address.currency} <FormattedMessage id="withdraw.memo" />
          </Typography>
          <QRCode value={address.tag} />
        </Box>
      )}
    </Box>
  );
};

export default DepositQRCodes;
