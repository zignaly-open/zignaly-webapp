import React from "react";
import "./TabsMenu.scss";
import { Tab, Tabs } from "@material-ui/core";
import { FormattedMessage } from "react-intl";

/**
 *
 * @typedef {import('@material-ui/core/Tabs').TabsProps.onChange} ChangeEvent
 */

/**
 *
 * @typedef {Object} DefaultProps
 * @property {Number} tabValue
 * @property {ChangeEvent} changeTab
 */

/**
 *
 * @param {DefaultProps} props
 */

const TabsMenu = (props) => {
  const { changeTab, tabValue } = props;

  return (
    <Tabs
      classes={{
        indicator: "indicator",
        flexContainer: "container",
        scroller: "hideScroll",
      }}
      className="tabsMenu"
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
      <Tab
        classes={{ selected: "selected" }}
        label={<FormattedMessage id="dashboard.positions.log" />}
      />
    </Tabs>
  );
};

export default TabsMenu;
