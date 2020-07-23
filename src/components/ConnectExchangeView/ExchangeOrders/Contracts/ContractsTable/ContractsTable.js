import React from "react";
import "./ContractsTable.scss";
import { Box } from "@material-ui/core";
import Table from "../../../../Table";
import { composeOrdersDataTable } from "../../../../../utils/composePositionsDataTable";
// import tradeApi from "../../../../../services/tradeApiClient";
// import useStoreSessionSelector from "../../../../../hooks/useStoreSessionSelector";
// import { ConfirmDialog } from "../../../../Dialogs";

/**
 * @typedef {import("../../../../../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../../../../../store/initialState").DefaultStateSession} StateSessionType
 * @typedef {import("mui-datatables").MUIDataTableColumn} MUIDataTableColumn
 * @typedef {import("mui-datatables").MUIDataTableMeta} MUIDataTableMeta
 * @typedef {import("../../../../../services/tradeApiClient.types").ExchangeOpenOrdersObject} ExchangeOpenOrdersObject
 * @typedef {import("@material-ui/core/styles").ThemeOptions} ThemeOptions
 * @typedef {import("@material-ui/core/styles").Theme} Theme
 * @typedef {import("../../../../../utils/composePositionsDataTable").DataTableContent} DataTableContent
 */

/**
 * Provides a table to display providers' profits stats.
 *
 * @typedef {Object} DefaultProps
 * @property {string | React.ReactNode} title Table title.
 * @property {Array<ExchangeOpenOrdersObject>} list
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} Component JSX.
 */
const ContractsTable = ({ title, list }) => {
  const tablePersistsKey = "contractsTable";
  // const storeSession = useStoreSessionSelector();

  // /**
  //  * @typedef {import("../../../../Dialogs/ConfirmDialog/ConfirmDialog").ConfirmDialogConfig} ConfirmDialogConfig
  //  * @type {ConfirmDialogConfig} initConfirmConfig
  //  */
  // const initConfirmConfig = {
  //   titleTranslationId: "",
  //   messageTranslationId: "",
  //   visible: false,
  // };

  // const [confirmConfig, setConfirmConfig] = useState(initConfirmConfig);
  // const [actionData, setActionData] = useState({
  //   positionId: "",
  //   action: "",
  // });

  // /**
  //  * Handle action element click event.
  //  *
  //  * @param {React.MouseEvent<HTMLButtonElement>} event Action element click.
  //  * @returns {Void} None.
  //  */
  // const confirmAction = (event) => {
  //   const targetElement = event.currentTarget;
  //   const positionId = targetElement.getAttribute("data-position-id");
  //   const action = targetElement.getAttribute("data-action");
  //   setActionData({
  //     action: action || "",
  //     positionId: positionId || "",
  //   });

  //   if (action === "cancel") {
  //     setConfirmConfig({
  //       titleTranslationId: "confirm.positioncancel.title",
  //       messageTranslationId: "confirm.positioncancel.message",
  //       visible: true,
  //     });
  //   }

  //   if (action === "exit") {
  //     setConfirmConfig({
  //       titleTranslationId: "confirm.positionexit.title",
  //       messageTranslationId: "confirm.positionexit.message",
  //       visible: true,
  //     });
  //   }
  // };

  // /**
  //  * Handle confirm dialog post confirmation, action execution.
  //  *
  //  * @returns {Void} None.
  //  */
  // const executeAction = () => {
  //   const { positionId, action } = actionData;
  //   if (action === "cancel") {
  //     tradeApi
  //       .positionClose({
  //         positionId: positionId,
  //         token: storeSession.tradeApi.accessToken,
  //       })
  //       .then((position) => {
  //         alert(`Position ${position.positionId} was cancelled.`);
  //       })
  //       .catch((e) => {
  //         alert(`Cancel position failed: ${e.message}`);
  //       });
  //   }

  //   if (action === "exit") {
  //     tradeApi
  //       .positionExit({
  //         positionId: positionId,
  //         token: storeSession.tradeApi.accessToken,
  //       })
  //       .then((position) => {
  //         alert(`Position ${position.positionId} was exited.`);
  //       })
  //       .catch((e) => {
  //         alert(`Exit position failed: ${e.message}`);
  //       });
  //   }
  // };

  /**
   * Compose MUI data table for positions collection of selected type.
   *
   * @returns {DataTableContent} Data table content.
   */
  const composeDataTableForOrders = () => {
    let dataTable;
    dataTable = composeOrdersDataTable(list);
    return dataTable;
  };

  const { columns, data } = composeDataTableForOrders();

  return (
    <>
      {/* <ConfirmDialog
        confirmConfig={confirmConfig}
        executeActionCallback={executeAction}
        setConfirmConfig={setConfirmConfig}
      /> */}
      <Box className="contractsTable" display="flex" flexDirection="column" width={1}>
        <Table columns={columns} data={data} persistKey={tablePersistsKey} title={title} />
      </Box>
    </>
  );
};

export default ContractsTable;
