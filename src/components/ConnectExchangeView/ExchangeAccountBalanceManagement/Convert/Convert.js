import React, { useContext, useState } from "react";
import { Box, Typography } from "@material-ui/core";
import "./Convert.scss";
import { FormattedMessage } from "react-intl";
import BalanceManagement from "../BalanceManagement";
import CustomButton from "../../../CustomButton";
import tradeApi from "../../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import useExchangeAssets from "../../../../hooks/useExchangeAssets";
import { useDispatch } from "react-redux";
import { showErrorAlert, showSuccessAlert } from "../../../../store/actions/ui";
import ConvertTable from "./ConvertTable";
import ModalPathContext from "../../ModalPathContext";
import { isEmpty } from "lodash";

/**
 * @typedef {import("../../../../services/tradeApiClient.types").ExchangeAsset} ExchangeAsset
 * @typedef {import("./ConvertTable/ConvertTable").ExchangeAssetsWithName} ExchangeAssetsWithName
 */

const Convert = () => {
  const {
    pathParams: { selectedAccount },
  } = useContext(ModalPathContext);
  const [isLoading, setIsLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [rowsSelected, setRowsSelected] = useState([]);
  const assets = useExchangeAssets(selectedAccount.internalId, updatedAt);
  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();

  /**
   * @type {ExchangeAssetsWithName}
   */
  let convertAssets = [];
  for (const [key, value] of Object.entries(assets)) {
    // Add assets that can be converted
    const balanceBTC = parseFloat(value.balanceFreeBTC);
    if (balanceBTC > 0 && balanceBTC <= 0.001 && key !== "BNB") {
      convertAssets.push({ ...assets[key], coin: key });
    }
  }

  const selectedAssets = rowsSelected.map((index) => convertAssets[index]);
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
        dispatch(showSuccessAlert("Success", "convert.success"));
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
   * @param {*} currentRowsSelected currentRowsSelected
   * @param {*} allRowsSelected allRowsSelected
   * @param {Array<Number>} _rowsSelected Selected rows indexes
   * @returns {void}
   */
  const onSelect = (currentRowsSelected, allRowsSelected, _rowsSelected) => {
    setRowsSelected(_rowsSelected);
  };

  return (
    <BalanceManagement>
      <Box className="exchangeAccountConvert">
        <Typography className="desc" variant="h3">
          <FormattedMessage id="convert.description" />
        </Typography>
        <Typography variant="body1">
          <FormattedMessage id="convert.note" />
        </Typography>
        <Box
          alignItems="center"
          className="convertAction"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
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
            <FormattedMessage id="accounts.convert" />
          </CustomButton>
        </Box>
        <ConvertTable
          assets={convertAssets}
          loading={isEmpty(assets)}
          onSelect={onSelect}
          rowsSelected={rowsSelected}
        />
      </Box>
    </BalanceManagement>
  );
};

export default Convert;
