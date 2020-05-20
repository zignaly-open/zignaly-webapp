import React, { useState } from "react";
import "./PositionsTabs.scss";
import { Box, Tab, Tabs, Popover } from "@material-ui/core";
import SettingsIcon from "../../../images/dashboard/settings.svg";
import FiltersUnchecked from "../../../images/dashboard/filtersHollow.svg";
import FilstersChecked from "../../../images/dashboard/filtersFill.svg";
import PositionSettingsForm from "../../Forms/PositionSettingsForm";
import PositionsTable from "../PositionsTable";
import PositionFilters from "../PositionFilters";
import { FormattedMessage } from "react-intl";
import NoPositions from "../NoPositions";
import CustomFilters from "../../CustomFilters";

const PositionsTabs = () => {
  const [tabValue, setTabValue] = useState(0);
  const [settingsAnchor, setSettingAnchor] = useState(undefined);
  const [filters, showFilters] = useState(false);

  /**
   * Event handler to change tab value.
   *
   * @param {Object} event Tab index to set active.
   * @param {Number} val Tab index to set active.
   * @returns {void}
   */

  const changeTab = (event, val) => {
    setTabValue(val);
  };

  const handleClose = () => setSettingAnchor(undefined);

  return (
    <Box bgcolor="grid.content" className="positionsTabs">
      <Box
        alignItems="center"
        className="tabsBox"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Tabs
          classes={{ indicator: "indicator", flexContainer: "container" }}
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
        <Box
          alignItems="center"
          className="settings"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <img
            alt="zignaly"
            className="icon"
            onClick={() => showFilters(!filters)}
            src={filters ? FilstersChecked : FiltersUnchecked}
          />
          <img
            alt="zignaly"
            className="icon"
            onClick={(e) => setSettingAnchor(e.currentTarget)}
            src={SettingsIcon}
          />
        </Box>
      </Box>
      {filters && (
        <PositionFilters onChange={handleFiltersChange} onClose={() => showFilters(false)} />
      )}
      {tabValue === 0 && (
        <Box className="tabPanel">
          <NoPositions />
        </Box>
      )}
      {tabValue === 1 && (
        <Box className="tabPanel">
          <PositionsTable />
        </Box>
      )}
      {tabValue === 2 && (
        <Box className="tabPanel">
          <PositionsTable />
        </Box>
      )}
      <Popover
        anchorEl={settingsAnchor}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        onClose={() => setSettingAnchor(undefined)}
        open={Boolean(settingsAnchor)}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <PositionSettingsForm onClose={handleClose} />
      </Popover>
    </Box>
  );
};

export default PositionsTabs;
