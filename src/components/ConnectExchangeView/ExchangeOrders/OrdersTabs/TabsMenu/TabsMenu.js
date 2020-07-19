import React from "react";
import "./TabsMenu.scss";
import { Tab, Tabs } from "@material-ui/core";
import { FormattedMessage } from "react-intl";

/**
 *
 * @typedef {import("@material-ui/core").TabTypeMap} TabTypeMap
 * @typedef {Object} DefaultProps
 * @property {Number} tabValue
 * @property {TabTypeMap["props"]["onChange"]} changeTab
 */

/**
 *
 * @param {DefaultProps} props
 */

const TabsMenu = (props) => {
  const { changeTab, tabValue } = props;

  return (
    <Tabs
      className="tabsMenu"
      classes={{
        indicator: "indicator",
        flexContainer: "container",
      }}
      onChange={changeTab}
      value={tabValue}
    >
      <Tab
        classes={{ selected: "selected" }}
        label={<FormattedMessage id="dashboard.balance.historical" />}
      />
      <Tab
        classes={{ selected: "selected" }}
        label={<FormattedMessage id="dashboard.balance.coins" />}
      />
    </Tabs>
  );
};

export default TabsMenu;
