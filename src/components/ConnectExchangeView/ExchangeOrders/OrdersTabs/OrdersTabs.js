import React, { useState, useContext } from "react";
import { Box } from "@mui/material";
import TabsMenu from "../../../TabsMenu";
import "./OrdersTabs.scss";
import Orders from "../Orders/Orders";
import { FormattedMessage } from "react-intl";
import ModalPathContext from "../../ModalPathContext";
import Contracts from "../Contracts";

const OrdersTabs = () => {
  const {
    pathParams: { selectedAccount },
  } = useContext(ModalPathContext);
  const [tabValue, setTabValue] = useState(0);

  const tabsList = [
    {
      display: true,
      label: <FormattedMessage id="accounts.orders" />,
    },
    {
      display: selectedAccount.exchangeType.toLowerCase() === "futures",
      label: <FormattedMessage id="accounts.contracts" />,
    },
  ];

  /**
   * Event handler to change tab value.
   *
   * @param {React.ChangeEvent<{checked: boolean}>} event Tab index to set active.
   * @param {Number} val Tab index to set active.
   * @returns {void}
   */
  const changeTab = (event, val) => {
    setTabValue(val);
  };

  return (
    <Box className="ordersTabs">
      <Box
        alignItems="flex-start"
        className="tabsBox"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        <TabsMenu changeTab={changeTab} tabValue={tabValue} tabs={tabsList} />
        {tabValue === 0 && (
          <Box className="tabPanel">
            <Orders />
          </Box>
        )}
        {tabValue === 1 && (
          <Box className="tabPanel">
            <Contracts />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default OrdersTabs;
