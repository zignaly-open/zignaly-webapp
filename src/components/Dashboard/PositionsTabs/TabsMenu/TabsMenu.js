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
 * @property {Boolean} [isProfile]
 */

/**
 *
 * @param {DefaultProps} props
 */

const TabsMenu = (props) => {
  const { changeTab, tabValue, isProfile } = props;

  return (
    <Tabs
      className="tabsMenu"
      classes={{
        indicator: "indicator",
        flexContainer: "container",
        scroller: "hideScroll",
      }}
      onChange={changeTab}
      value={tabValue}
    >
      <Tab
        classes={{ selected: "selected" }}
        label={<FormattedMessage id="dashboard.positions.open" />}
      />
      <Tab
        classes={{ selected: "selected" }}
        label={<FormattedMessage id="dashboard.positions.closed" />}
      />
      {!isProfile && (
        <Tab
          classes={{ selected: "selected" }}
          label={<FormattedMessage id="dashboard.positions.log" />}
        />
      )}
    </Tabs>
  );
};

export default TabsMenu;
