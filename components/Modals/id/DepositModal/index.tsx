// Dependencies
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import QRCode from "qrcode.react";

// Styled Components
import { ModalContainer, Title, Body, Actions } from "../styles";

// Assets
import { Button } from "zignaly-ui";
import { closeModal } from "src/store/actions/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { useExchangeAssets, useExchangeDepositAddress } from "lib/useAPI";
import useUser from "lib/useUser";
import Loader from "components/Loader/Loader";
import AssetSelect from "components/common/AssetSelect";
import NetworkSelect from "components/common/NetworkSelect";
import { TextField } from "@mui/material";

import * as styled from "./styles";
import NumberFormat from "react-number-format";

type DepositModalTypesProps = {
  action?: any;
  initialCoin: string;
};

function DepositModal({ action = null, initialCoin }: DepositModalTypesProps): React.ReactElement {
  return <Button>a</Button>;
}

export default DepositModal;
