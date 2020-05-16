import React, { useState } from "react";
import PropTypes from "prop-types";
import "./ProvidersHeader.scss";
import { Box, Icon } from "@material-ui/core";
import SubNavHeader from "../../SubNavHeader";
import SortIcon from "../../../images/filters/sort.svg";
import SortFillIcon from "../../../images/filters/sort-fill.svg";
import FilterIcon from "../../../images/filters/filter.svg";
import FilterFillIcon from "../../../images/filters/filter-fill.svg";

const ProvidersHeader = ({ showFilters, showSort, toggleFilters, toggleSort }) => {
  const links = [
    {
      name: "Browse",
      to: "/copyTraders/browse",
    },
    {
      name: "Analytics",
      to: "/copyTraders/analytics",
    },
  ];
  return (
    <Box className="providersHeader">
      <SubNavHeader links={links}>
        <Box
          alignItems="center"
          className="settings"
          display="flex"
          flexDirection="row"
          justifyContent="space-around"
        >
          <Icon>
            <img
              alt="zignaly"
              className="icon"
              onClick={() => toggleFilters()}
              src={showFilters ? FilterFillIcon : FilterIcon}
            />
          </Icon>

          <Icon>
            <img
              alt="zignaly"
              className="icon"
              onClick={() => toggleSort()}
              src={showSort ? SortFillIcon : SortIcon}
            />
          </Icon>
        </Box>
      </SubNavHeader>
    </Box>
  );
};
ProvidersHeader.propTypes = {
  toggleFilters: PropTypes.func,
  toggleSort: PropTypes.func,
  showFilters: PropTypes.bool,
  showSort: PropTypes.bool,
};
export default ProvidersHeader;
