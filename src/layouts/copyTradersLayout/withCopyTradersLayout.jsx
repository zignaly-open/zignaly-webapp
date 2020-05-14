import React, { useState } from "react"
import "../../styles/common.sass"
import "./copyTradersLayout.sass"
import { getDisplayName } from "../../utils"
import { Box, Typography } from "@material-ui/core"
import FAQ from "../../components/FAQ"
import ProvidersHeader from "../../components/Providers/ProvidersHeader"

const withDashboardLayout = Component => {
  const WrapperComponent = props => {
    const [filters, showFilters] = useState(false)
    const [sorting, showSorting] = useState(false)

    const toggleFilters = val => {
      showFilters(!filters)
    //   props.onFiltersOpen(val)
    }

    const toggleSorting = val => {
      setValue(val)
      props.onFiltersOpen(val)
    }

    return (
      <Box
        className="copyTradersLayout"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Box className="titleBox" display="flex" flexDirection="column">
          <Typography variant="h1">Copy Traders</Typography>
          <h4 className="subHeader">
            Copy experienced traders who trade with the currencies you own.
          </h4>
        </Box>

        <ProvidersHeader toggleFilters={toggleFilters} filters={filters} />
        <Box className="pageContent">
          <Component
            {...props}
            toggleFilters={toggleFilters}
            filters={filters}
          />
        </Box>
        <Box className="faq">
          <FAQ />
        </Box>
      </Box>
    )
  }
  WrapperComponent.displayName = `Layout(${getDisplayName(Component)})`
  return WrapperComponent
}

export default withDashboardLayout
