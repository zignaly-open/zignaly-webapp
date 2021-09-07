import React, { useState } from "react";
import "./ContractsTable.scss";
import { Box, CircularProgress, Tooltip } from "@material-ui/core";
import Table from "../../../../Table";
import { formatFloat } from "../../../../../utils/format";
import { Link } from "gatsby";
import { ConfirmDialog } from "../../../../Dialogs";
import { useDispatch } from "react-redux";
import tradeApi from "../../../../../services/tradeApiClient";
import { showErrorAlert } from "../../../../../store/actions/ui";
import { Delete } from "react-feather";
import { FormattedMessage } from "react-intl";

/**
 * @typedef {import("../../../../../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../../../../../store/initialState").DefaultStateSession} StateSessionType
 * @typedef {import("mui-datatables").MUIDataTableColumn} MUIDataTableColumn
 * @typedef {import("mui-datatables").MUIDataTableMeta} MUIDataTableMeta
 * @typedef {import("../../../../../services/tradeApiClient.types").ExchangeContractsObject} ExchangeContractsObject
 * @typedef {import("../../../../../services/tradeApiClient.types").ExchangeConnectionEntity} ExchangeConnectionEntity
 * @typedef {import("../../../../../services/tradeApiClient.types").DefaultProviderGetObject} DefaultProviderGetObject
 * @typedef {import("@material-ui/core/styles").ThemeOptions} ThemeOptions
 * @typedef {import("@material-ui/core/styles").Theme} Theme
 * @typedef {import("../../../../../utils/composePositionsDataTable").DataTableContent} DataTableContent
 */

/**
 * Provides a table to display providers' profits stats.
 *
 * @typedef {Object} DefaultProps
 * @property {string | React.ReactNode} title Table title.
 * @property {string} persistKey Table title.
 * @property {Array<ExchangeContractsObject>} list
 * @property {Function} loadData
 * @property {ExchangeConnectionEntity} selectedAccount
 * @property {DefaultProviderGetObject} [provider]
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} Component JSX.
 */
const ContractsTable = ({ title, list, loadData, selectedAccount, provider, persistKey }) => {
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState("");

  /**
   * @typedef {import("../../../../Dialogs/ConfirmDialog/ConfirmDialog").ConfirmDialogConfig} ConfirmDialogConfig
   * @type {ConfirmDialogConfig} initConfirmConfig
   */
  const initConfirmConfig = {
    titleTranslationId: "",
    messageTranslationId: "",
    visible: false,
  };

  const [confirmConfig, setConfirmConfig] = useState(initConfirmConfig);
  const dispatch = useDispatch();

  /**
   *
   * @param {string} data ID of the user.
   * @returns {void} None.
   */
  const confirmCancel = (data) => {
    setPosition(data);
    setConfirmConfig({
      titleTranslationId: "contract.cancel.title",
      messageTranslationId: "contract.cancel.subtitle",
      visible: true,
    });
  };

  /**
   *
   * @returns {void} None.
   */
  const cancelContract = () => {
    setLoading(true);
    const contract = list.find((item) => item.id === position);
    const payload = {
      exchangeInternalId: selectedAccount.internalId,
      symbol: contract.symbol,
      amount: contract.amount.toString(),
      ...(provider && { providerId: provider.id }),
    };

    tradeApi
      .cancelExchangeContract(payload)
      .then(() => {
        setLoading(false);
        loadData();
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
        setLoading(false);
      });
  };

  /**
   * Compose all action buttons element for a given position.
   *
   * @param {String} id Position entity to compose buttons for.
   * @returns {JSX.Element} Composed JSX element.
   */
  function composePositionLinkButton(id) {
    return (
      <Link className="link" to={`/position/${id}`}>
        {id}
      </Link>
    );
  }

  /**
   * @type {Array<MUIDataTableColumn>} Table columns
   */
  let columns = [
    {
      name: "positionId",
      label: "col.positionid",
      options: {
        customBodyRender: composePositionLinkButton,
      },
    },
    {
      name: "symbol",
      label: "col.pair",
    },
    {
      name: "amount",
      label: "col.amount",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "leverage",
      label: "col.leverage",
    },
    {
      name: "liquidationprice",
      label: "col.contracts.liquidationprice",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "side",
      label: "col.side",
    },
    {
      name: "entryprice",
      label: "col.entryprice",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "markprice",
      label: "col.contracts.markprice",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "margin",
      label: "col.contracts.margin",
    },
    {
      name: "id",
      label: "col.close",
      options: {
        customBodyRender: (val) => {
          return loading && position === val ? (
            <CircularProgress color="primary" size={24} />
          ) : (
            <Tooltip placement="top" title={<FormattedMessage id="col.close" />}>
              <Delete
                className="cancelIcon red" // @ts-ignore
                onClick={() => confirmCancel(val)}
              />
            </Tooltip>
          );
        },
      },
    },
  ];

  return (
    <>
      <Box className="contractsTable" display="flex" flexDirection="column" width={1}>
        <ConfirmDialog
          confirmConfig={confirmConfig}
          executeActionCallback={cancelContract}
          setConfirmConfig={setConfirmConfig}
        />
        <Table columns={columns} data={list} persistKey={persistKey} title={title} />
      </Box>
    </>
  );
};

export default ContractsTable;
