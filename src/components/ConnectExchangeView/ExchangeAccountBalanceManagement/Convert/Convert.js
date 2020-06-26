import React, { useEffect, useContext, useState } from "react";
import { Box, Typography, CircularProgress, OutlinedInput, FormControl } from "@material-ui/core";
import "./Convert.scss";
import TransferCoinPicker from "../TransferCoinPicker";
import TipBox from "../TipBox";
import { FormattedMessage, useIntl } from "react-intl";
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

/**
 * @typedef {import("../../../../services/tradeApiClient.types").ExchangeAsset} ExchangeAsset
 * @typedef {import("./ConvertTable/ConvertTable").ExchangeAssetsWithName} ExchangeAssetsWithName
 */

const Convert = () => {
  const {
    pathParams: { selectedAccount },
    setTitle,
  } = useContext(ModalPathContext);
  const [isLoading, setIsLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [rowsSelected, setRowsSelected] = useState([]);
  const assets = useExchangeAssets(selectedAccount.internalId, updatedAt);
  const intl = useIntl();
  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();

  /**
   * @type {ExchangeAssetsWithName}
   */
  let assetsList = [];
  for (const [key, value] of Object.entries(assets)) {
    const balanceBTC = parseFloat(value.balanceFreeBTC);
    if (balanceBTC > 0 && balanceBTC <= 0.001) {
      assetsList.push({ ...assets[key], coin: key });
    }
  }

  const selectedAssets = rowsSelected.map((index) => assetsList[index]);
  const totalSelectedBNB = selectedAssets.reduce(
    (total, a) => total + parseFloat(a.balanceTotalExchCoin),
    0,
  );

  const handleSubmit = () => {
    setIsLoading(true);

    const selectedCoins = selectedAssets.map((a) => a.coin);
    const payload = {
      token: storeSession.tradeApi.accessToken,
      internalId: selectedAccount.internalId,
      assets: selectedCoins,
    };

    tradeApi
      .convert(payload)
      .then(() => {
        dispatch(showSuccessAlert("Success", "Converted"));
        // Update coins table
        setUpdatedAt(new Date());
        // Reset selection
        setRowsSelected([]);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  /**
   * @param {*} currentRowsSelected
   * @param {*} allRowsSelected
   * @param {Array<Number>} rowsSelected
   */
  const onSelect = (currentRowsSelected, allRowsSelected, rowsSelected) => {
    setRowsSelected(rowsSelected);
  };

  return (
    <BalanceManagement>
      <Box className="exchangeAccountConvert">
        <Typography variant="h3" className="desc">
          <FormattedMessage id="convert.description" />
        </Typography>
        <Typography variant="body1">
          <FormattedMessage id="convert.note" />
        </Typography>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          className="convertAction"
        >
          <Typography variant="body1">
            <FormattedMessage id="convert.selected" /> <b>{rowsSelected.length}</b>{" "}
            <FormattedMessage id="convert.converto" />
            <b> {totalSelectedBNB} BNB </b>
            <FormattedMessage id="convert.net" />
          </Typography>
          <CustomButton
            className="bgPurple"
            disabled={!rowsSelected.length || isLoading}
            loading={isLoading}
            onClick={handleSubmit}
          >
            <Typography variant="body2">
              <FormattedMessage id="accounts.convert" />
            </Typography>
          </CustomButton>
        </Box>
        <ConvertTable assets={assetsList} onSelect={onSelect} rowsSelected={rowsSelected} />
      </Box>
    </BalanceManagement>
  );
};

export default Convert;
