import React from "react";
import "./TabsMenu.scss";
import { Tab, Tabs } from "@mui/material";

/**
 *
 * @typedef {Object} DefaultTabsObject
 * @property {Boolean} display
 * @property {JSX.Element|String} label
 */

/**
 *
 * @typedef {import("@mui/material").TabTypeMap} TabTypeMap
 * @typedef {Object} DefaultProps
 * @property {Number} tabValue
 * @property {TabTypeMap["props"]["onChange"]} changeTab
 * @property {Array<DefaultTabsObject>} tabs
 */

/**
 *
 * @param {DefaultProps} props
 */

const TabsMenu = (props) => {
  const { changeTab, tabValue, tabs } = props;

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
      {tabs.map(
        (item, index) =>
          item.display && <Tab classes={{ selected: "selected" }} key={index} label={item.label} />,
      )}
    </Tabs>
  );
};

export default TabsMenu;
