import React, { useState } from "react";
import { Box, Typography } from "@material-ui/core";
import "./Convert.scss";
import { FormattedMessage } from "react-intl";
import BalanceManagement from "../BalanceManagement";
import CustomButton from "../../../CustomButton";
import tradeApi from "../../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { showErrorAlert, showSuccessAlert } from "../../../../store/actions/ui";
import ConvertTable from "./ConvertTable";
import { isEmpty } from "lodash";

/**
 * @typedef {import("../../../../services/tradeApiClient.types").ExchangeAsset} ExchangeAsset
 * @typedef {import("../../../../services/tradeApiClient.types").ExchangeAssetsDict} ExchangeAssetsDict
 * @typedef {import("../../../../services/tradeApiClient.types").ExchangeConnectionEntity} ExchangeConnectionEntity
 * @typedef {import("./ConvertTable/ConvertTable").ExchangeAssetsWithName} ExchangeAssetsWithName
 */

/**
 * @typedef {Object} DefaultProps
 * @property {ExchangeAssetsDict} assets Exchange assets
 * @property {ExchangeConnectionEntity} selectedAccount Exchange assets
 * @property {Function} loadData Exchange assets
 * @property {Boolean} showHeader Boolean to hide/show tabs
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const Convert = ({ assets, loadData, selectedAccount, showHeader }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [rowsSelected, setRowsSelected] = useState([]);
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
        loadData();
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
    <>
      {showHeader ? (
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
      ) : (
        <>
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
        </>
      )}
    </>
  );
};

export default Convert;
