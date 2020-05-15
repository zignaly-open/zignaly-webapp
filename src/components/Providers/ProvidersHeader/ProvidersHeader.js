import React, { useState } from "react"
import PropTypes from "prop-types"
import "./ProvidersHeader.sass"
import { Box, Icon } from "@material-ui/core"
import Link from "../../LocalizedLink"
import SortIcon from "../../../images/filters/sort.svg"
import SortFillIcon from "../../../images/filters/sort-fill.svg"
import FilterIcon from "../../../images/filters/filter.svg"
import FilterFillIcon from "../../../images/filters/filter-fill.svg"

const ProvidersHeader = ({
  showFilters,
  showSort,
  toggleFilters,
  toggleSort,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
      alignItems="center"
      className="providersHeader"
    >
      <Link
        to="/copyTraders/browse"
        className="dashboardLink"
        activeClassName="active"
      >
        Browse
      </Link>
      <Link
        to="/copyTraders/analytics"
        className="dashboardLink"
        activeClassName="active"
      >
        Analytics
      </Link>
      <Box
        className="settings"
        display="flex"
        flexDirection="row"
        justifyContent="space-around"
        alignItems="center"
      >
        <Icon>
          <img
            onClick={() => toggleFilters()}
            src={showFilters ? FilterFillIcon : FilterIcon}
            alt="zignaly"
            className="icon"
          />
        </Icon>

        <Icon>
          <img
            onClick={() => toggleSort()}
            src={showSort ? SortFillIcon : SortIcon}
            alt="zignaly"
            className="icon"
          />
        </Icon>
      </Box>
    </Box>
  )
}
ProvidersHeader.propTypes = {
  toggleFilters: PropTypes.func,
  toggleSort: PropTypes.func,
  showFilters: PropTypes.bool,
  showSort: PropTypes.bool,
}
export default ProvidersHeader
