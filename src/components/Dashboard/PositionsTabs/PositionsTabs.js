import { PositionsTabContent } from "./";
import React, { useState } from "react";
import "./PositionsTabs.scss";
import { Box, Popover } from "@material-ui/core";
import SettingsIcon from "../../../images/dashboard/settings.svg";
import FiltersUnchecked from "../../../images/dashboard/filtersHollow.svg";
import FilstersChecked from "../../../images/dashboard/filtersFill.svg";
import PositionSettingsForm from "../../Forms/PositionSettingsForm";
import TabsMenu from "./TabsMenu";

/**
 * @typedef {import("../../../hooks/usePositionsList").PositionsCollectionType} PositionsCollectionType
 */

const PositionsTabs = () => {
  const [tabValue, setTabValue] = useState(0);
  const [filters, showFilters] = useState(false);
  const [settingsAnchor, setSettingAnchor] = useState(undefined);

  /**
   * Map tab index to positions collection type.
   *
   * @returns {PositionsCollectionType} Collection type.
   */
  const mapIndexToCollectionType = () => {
    switch (tabValue) {
      case 1:
        return "closed";

      case 2:
        return "log";

      default:
        return "open";
    }
  };

  const selectedType = mapIndexToCollectionType();
  const handleClose = () => {
    setSettingAnchor(undefined);
  };

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
    <Box bgcolor="grid.content" className="positionsTabs">
      <Box
        alignItems="center"
        className="tabsBox"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        <TabsMenu changeTab={changeTab} tabValue={tabValue} />
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
      <PositionsTabContent type={selectedType} />
      <Popover
        anchorEl={settingsAnchor}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={() => setSettingAnchor(undefined)}
        open={Boolean(settingsAnchor)}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <PositionSettingsForm onClose={handleClose} />
      </Popover>
    </Box>
  );
};

export default PositionsTabs;
