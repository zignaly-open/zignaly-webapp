import React, { useEffect, useContext, useState } from "react";
import { Box, Typography, CircularProgress, OutlinedInput, FormControl } from "@material-ui/core";
import "./Convert.scss";
import TransferCoinPicker from "../TransferCoinPicker";
import TipBox from "../TipBox";
import { FormattedMessage } from "react-intl";
import useAssetsSelect from "../../../../hooks/useAssetsSelect";
import AlertIcon from "../../../../images/exchangeAccount/alert.svg";
import BalanceManagement from "../BalanceManagement";
import NetworksToggleGroup from "../NetworksToggleGroup";
import CustomButton from "../../../CustomButton";
import { formatFloat } from "../../../../utils/format";
import { useForm } from "react-hook-form";
import tradeApi from "../../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import useExchangeAssets from "../../../../hooks/useExchangeAssets";
import { useDispatch } from "react-redux";
import { showErrorAlert, showSuccessAlert } from "../../../../store/actions/ui";
import ConvertTable from "./ConvertTable";
import ModalPathContext from "../../ModalPathContext";

const Convert = () => {
  const {
    pathParams: { selectedAccount },
    setTitle,
  } = useContext(ModalPathContext);
  const [isLoading, setIsLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(null);
  const assets = useExchangeAssets(selectedAccount.internalId, updatedAt);

  let assetsList = [];
  for (const [key, value] of Object.entries(assets)) {
    const balanceBTC = parseFloat(value.balanceFreeBTC);
    if (balanceBTC > 0 && balanceBTC <= 0.001) {
      assetsList.push({ ...assets[key], coin: key });
    }
  }

  const storeSession = useStoreSessionSelector();

  const handleSubmit = () => {
    setIsLoading(true);

    const payload = {
      token: storeSession.tradeApi.accessToken,
      internalId: selectedAccount.internalId,
      asset: selectedAssetName,
      network: selectedNetwork.network,
      tag: data.memo,
      address: data.address,
      amount: parseFloat(data.amount),
    };

    tradeApi
      .withdraw(payload)
      .then(() => {
        dispatch(showSuccessAlert("", "withdraw.success"));
        // Update withdraw history table and assets balance
        setUpdatedAt(new Date());
        // Reset form
        reset();
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onSelect = (currentRowsSelected, allRowsSelected, rowsSelected) => {
    console.log(currentRowsSelected, allRowsSelected, rowsSelected);
  };

  return (
    <BalanceManagement>
      <Box className="exchangeAccountConvert">
        <Typography variant="h3">
          <FormattedMessage id="convert.description" />
        </Typography>
        <Typography variant="body1">
          <FormattedMessage id="convert.note" />
        </Typography>
        <Box display="flex" flexDirection="row">
          <Typography variant="body1">
            <FormattedMessage id="convert.selected" />
            <FormattedMessage id="convert.converto" />
            <FormattedMessage id="convert.net" />
          </Typography>
          <CustomButton
            className="bgPurple"
            disabled={false}
            loading={isLoading}
            onClick={handleSubmit}
          >
            <Typography variant="body2">
              <FormattedMessage id="accounts.convert" />
            </Typography>
          </CustomButton>
        </Box>
        <ConvertTable assets={assetsList} onSelect={onSelect} />
      </Box>
    </BalanceManagement>
  );
};

export default Convert;
