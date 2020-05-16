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

const PositionsTabs = (props) => {
  const [tabValue, setTabValue] = useState(0);
  const [settingsAnchor, setSettingAnchor] = useState(undefined);
  const [filters, showFilters] = useState(false);

  const changeTab = (event, newValue) => {
    setTabValue(newValue);
  };

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
          className="tabs-menu"
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
      {filters && <PositionFilters onClose={() => showFilters(false)} />}
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
        <PositionSettingsForm onClose={() => setSettingAnchor(undefined)} />
      </Popover>
    </Box>
  );
};

export default PositionsTabs;
