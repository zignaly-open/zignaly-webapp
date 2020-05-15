import React, { useState } from "react"
import "../../styles/common.sass"
import "./copyTradersLayout.sass"
import { getDisplayName } from "../../utils"
import { Box, Typography } from "@material-ui/core"
import FAQ from "../../components/FAQ"
import ProvidersHeader from "../../components/Providers/ProvidersHeader"

const withDashboardLayout = Component => {
  const WrapperComponent = props => {
    const [showFilters, setShowFilters] = useState(false)
    const [showSort, setShowSort] = useState(false)

    const toggleFilters = () => {
      setShowFilters(!showFilters)
    }

    const toggleSort = () => {
      setShowSort(!showSort)
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

        <ProvidersHeader
          toggleFilters={toggleFilters}
          toggleSort={toggleSort}
          showFilters={showFilters}
          showSort={showSort}
        />
        <Box className="pageContent">
          <Component
            {...props}
            toggleFilters={toggleFilters}
            toggleSort={toggleSort}
            showFilters={showFilters}
            showSort={showSort}
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
