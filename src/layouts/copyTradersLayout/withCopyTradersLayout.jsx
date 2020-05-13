import React from "react"
import "../../styles/common.sass"
import "./copyTradersLayout.sass"
import { getDisplayName } from "../../utils"
import { Box, Typography } from "@material-ui/core"
import FAQ from "../../components/FAQ"
import ProvidersHeader from "../../components/Providers/ProvidersHeader"

const withDashboardLayout = Component => {
  const WrapperComponent = props => {
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

        <React.Fragment>
          <ProvidersHeader />
          <Box className="pageContent">
            <Component {...props} />
          </Box>
          <Box className="faq">
            <FAQ />
          </Box>
        </React.Fragment>
      </Box>
    )
  }
  WrapperComponent.displayName = `Layout(${getDisplayName(Component)})`
  return WrapperComponent
}

export default withDashboardLayout
