import React, { useState } from "react"
import "./ProvidersHeader.sass"
import { Box } from "@material-ui/core"
import Link from "../../LocalizedLink"
import PositionFilters from "../../Dashboard/PositionFilters"
import SettingsIcon from "../../../images/dashboard/settings.svg"
import FiltersUnchecked from "../../../images/dashboard/filtersHollow.svg"
import FilstersChecked from "../../../images/dashboard/filtersFill.svg"

const ProvidersHeader = () => {
  const [filters, showFilters] = useState(false)

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
          onClick={() => showFilters(!filters)}
          src={filters ? FilstersChecked : FiltersUnchecked}
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

export default ProvidersHeader
