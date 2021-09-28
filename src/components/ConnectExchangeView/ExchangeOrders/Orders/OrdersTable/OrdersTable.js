import React, { useState } from "react";
import "./OrdersTable.scss";
import { Box, CircularProgress, Tooltip } from "@material-ui/core";
import Table from "../../../../Table";
import tradeApi from "../../../../../services/tradeApiClient";
import { ConfirmDialog } from "../../../../Dialogs";
import { useDispatch } from "react-redux";
import { showErrorAlert, showSuccessAlert } from "../../../../../store/actions/ui";
import { Link } from "gatsby";
import { formatFloat } from "../../../../../utils/format";
import { Delete } from "react-feather";
import { FormattedMessage } from "react-intl";

/**
 * @typedef {import("../../../../../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../../../../../store/initialState").DefaultStateSession} StateSessionType
 * @typedef {import("mui-datatables").MUIDataTableColumn} MUIDataTableColumn
 * @typedef {import("mui-datatables").MUIDataTableMeta} MUIDataTableMeta
 * @typedef {import("mui-datatables").MUIDataTableOptions} MUIDataTableOptions
 * @typedef {import("../../../../../services/tradeApiClient.types").ExchangeOpenOrdersObject} ExchangeOpenOrdersObject
 * @typedef {import("../../../../../services/tradeApiClient.types").DefaultProviderGetObject} DefaultProviderGetObject
 * @typedef {import("@material-ui/core/styles").ThemeOptions} ThemeOptions
 * @typedef {import("@material-ui/core/styles").Theme} Theme
 * @typedef {import("../../../../../services/tradeApiClient.types").ExchangeConnectionEntity} ExchangeConnectionEntity
 * @typedef {import("../../../../../utils/composePositionsDataTable").DataTableContent} DataTableContent
 */

/**
 * Provides a table to display providers' profits stats.
 *
 * @typedef {Object} DefaultProps
 * @property {string | React.ReactNode} title Table title.
 * @property {string} persistKey Table title.
 * @property {Array<ExchangeOpenOrdersObject>} list
 * @property {ExchangeConnectionEntity} selectedAccount
 * @property {DefaultProviderGetObject} [provider]
 * @property {Function} loadData
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} Component JSX.
 */
const OrdersTable = ({ title, list, selectedAccount, loadData, provider, persistKey }) => {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState("");
  const dispatch = useDispatch();

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
      name: "orderId",
      label: "col.orders.orderid",
    },
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
      name: "status",
      label: "col.orders.status",
    },
    {
      name: "price",
      label: "col.orders.price",
    },
    {
      name: "side",
      label: "col.side",
    },
    {
      name: "type",
      label: "col.orders.type",
    },
    {
      name: "datetimeReadable",
      label: "col.orders.datetime",
    },
    {
      name: "id",
      label: "col.close",
      options: {
        customBodyRender: (val) => {
          return loading && order === val ? (
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

  /**
   * Handle action element click event.
   *
   * @param {String} id Order id.
   * @returns {Void} None.
   */
  const confirmCancel = (id) => {
    setOrder(id);
    const data = list.find((item) => item.id === id);

    setConfirmConfig({
      titleTranslationId: "confirm.ordercancel.title",
      messageTranslationId: "confirm.ordercancel.message",
      visible: true,
      values: {
        order: <b>{data ? data.orderId : "Null"}</b>,
      },
    });
  };

  /**
   * Handle confirm dialog post confirmation, action execution.
   *
   * @returns {Void} None.
   */
  const executeAction = () => {
    setLoading(true);
    const found = list.find((item) => item.id === order);
    const payload = {
      orderId: found.orderId,
      symbol: found.symbol,
      exchangeInternalId: selectedAccount.internalId,
      ...(provider && { providerId: provider.id }),
    };
    tradeApi
      .cancelExchangeOrder(payload)
      .then(() => {
        dispatch(showSuccessAlert("orders.alert.title", "orders.alert.body"));
        loadData();
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /**
   * @type {MUIDataTableOptions}
   */
  const options = {
    sortOrder: {
      name: "datetimeReadable",
      direction: "desc",
    },
  };

  return (
    <>
      <ConfirmDialog
        confirmConfig={confirmConfig}
        executeActionCallback={executeAction}
        setConfirmConfig={setConfirmConfig}
      />
      <Box className="ordersTable" display="flex" flexDirection="column" width={1}>
        <Table
          columns={columns}
          data={list}
          options={options}
          persistKey={persistKey}
          title={title}
        />
      </Box>
    </>
  );
};

export default OrdersTable;
