import React, { useState } from "react";
import "./OrdersTable.scss";
import { Box } from "@material-ui/core";
import Table from "../../../../Table";
import { composeOrdersDataTable } from "../../../../../utils/composePositionsDataTable";
import tradeApi from "../../../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../../../hooks/useStoreSessionSelector";
import { ConfirmDialog } from "../../../../Dialogs";
import { useDispatch } from "react-redux";
import { showErrorAlert, showSuccessAlert } from "../../../../../store/actions/ui";

/**
 * @typedef {import("../../../../../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../../../../../store/initialState").DefaultStateSession} StateSessionType
 * @typedef {import("mui-datatables").MUIDataTableColumn} MUIDataTableColumn
 * @typedef {import("mui-datatables").MUIDataTableMeta} MUIDataTableMeta
 * @typedef {import("../../../../../services/tradeApiClient.types").ExchangeOpenOrdersObject} ExchangeOpenOrdersObject
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
 * @property {Array<ExchangeOpenOrdersObject>} list
 * @property {ExchangeConnectionEntity} selectedAccount
 * @property {Function} loadData
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} Component JSX.
 */
const OrdersTable = ({ title, list, selectedAccount, loadData }) => {
  const tablePersistsKey = "ordersTable";
  const storeSession = useStoreSessionSelector();
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
  const [actionData, setActionData] = useState("");

  /**
   * Handle action element click event.
   *
   * @param {React.MouseEvent<HTMLButtonElement>} event Action element click.
   * @returns {Void} None.
   */
  const confirmAction = (event) => {
    const targetElement = event.currentTarget;
    const orderId = targetElement.getAttribute("data-order-id");
    setActionData(orderId);

    setConfirmConfig({
      titleTranslationId: "confirm.ordercancel.title",
      messageTranslationId: "confirm.ordercancel.message",
      visible: true,
      values: { order: <b>{orderId}</b> },
    });
  };

  /**
   * Handle confirm dialog post confirmation, action execution.
   *
   * @returns {Void} None.
   */
  const executeAction = () => {
    const found = list.find((item) => item.orderId === actionData);
    tradeApi
      .cancelExchangeOrder({
        orderId: found.orderId,
        token: storeSession.tradeApi.accessToken,
        symbol: found.symbol,
        exchangeInternalId: selectedAccount.internalId,
      })
      .then(() => {
        dispatch(showSuccessAlert("orders.alert.title", "orders.alert.body"));
        loadData();
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };

  /**
   * Compose MUI data table for positions collection of selected type.
   *
   * @returns {DataTableContent} Data table content.
   */
  const composeDataTableForOrders = () => {
    let dataTable;
    dataTable = composeOrdersDataTable(list, confirmAction);
    return dataTable;
  };

  const { columns, data } = composeDataTableForOrders();

  return (
    <>
      <ConfirmDialog
        confirmConfig={confirmConfig}
        executeActionCallback={executeAction}
        setConfirmConfig={setConfirmConfig}
      />
      <Box className="ordersTable" display="flex" flexDirection="column" width={1}>
        <Table columns={columns} data={data} persistKey={tablePersistsKey} title={title} />
      </Box>
    </>
  );
};

export default OrdersTable;
