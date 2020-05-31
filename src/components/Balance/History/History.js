import React, { useState } from "react";
import "./History.scss";
import { Box, Popover, Typography } from "@material-ui/core";
import SettingsIcon from "../../../images/dashboard/settings.svg";
import FiltersUnchecked from "../../../images/dashboard/filtersHollow.svg";
import FilstersChecked from "../../../images/dashboard/filtersFill.svg";
// import PositionsTable from "../../Dashboard/PositionsTable";
import PositionFilters from "../../Dashboard/PositionFilters";
import { FormattedMessage } from "react-intl";

const History = () => {
  const [settingsAnchor, setSettingAnchor] = useState(undefined);
  const [filters, showFilters] = useState(false);

  const handleChange = () => {};

  return (
    <Box
      alignItems="flex-start"
      bgcolor="grid.content"
      className="history"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      <Box
        alignItems="center"
        className="historyHeader"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Typography className="boxTitle" variant="h4">
          <FormattedMessage id="dashboard.balance.historical" />
        </Typography>
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
      {filters && <PositionFilters onChange={handleChange} onClose={() => showFilters(false)} />}
      {/** <PositionsTable type="closed" /> */}
      <Popover
        anchorEl={settingsAnchor}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        onClose={() => setSettingAnchor(undefined)}
        open={Boolean(settingsAnchor)}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      />
    </Box>
  );
};

export default History;
