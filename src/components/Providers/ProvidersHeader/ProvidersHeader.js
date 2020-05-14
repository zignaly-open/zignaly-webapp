import React, { useState } from "react"
import PropTypes from "prop-types"
import "./ProvidersHeader.sass"
import { Box } from "@material-ui/core"
import Link from "../../LocalizedLink"
import PositionFilters from "../../Dashboard/PositionFilters"
import SettingsIcon from "../../../images/dashboard/settings.svg"
import FiltersUnchecked from "../../../images/dashboard/filtersHollow.svg"
import FilstersChecked from "../../../images/dashboard/filtersFill.svg"

const ProvidersHeader = (props) => {
    // const [filters, showFilters] = useState(false)
    //   const handle = val => {
    //     setValue(val)
    //     props.onFiltersOpen(val)
    //   }

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
        <img
          onClick={() => props.toggleFilters()}
          src={props.filters ? FilstersChecked : FiltersUnchecked}
          alt="zignaly"
          className="icon"
        />
        <img
          onClick={e => setSettingAnchor(e.currentTarget)}
          src={SettingsIcon}
          alt="zignaly"
          className="icon"
        />
      </Box>
      {/* <PositionFilters onClose={() => showFilters(false)} /> */}
    </Box>
  )
}
ProvidersHeader.propTypes = {
  onFiltersOpen: PropTypes.func,
}
export default ProvidersHeader
