import React, { useState } from "react"
import "../../styles/common.sass"
import "./copyTradersLayout.sass"
import { getDisplayName } from "../../utils"
import { Box, Typography } from "@material-ui/core"
import FAQ from "../../components/FAQ"
import DashboardHeader from "../../components/Dashboard/DashboardHeader"

const withDashboardLayout = Component => {
  const WrapperComponent = props => {
    const [exchange, setExchange] = useState(true)

    return (
      <Box
        className="copyTradersLayout"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Box className="titleBox" display="flex" flexDirection="column">
          <Typography variant="h1">
            Copy Traders
          </Typography>
          <h4 className="subHeader">
            Copy experienced traders who trade with the currencies you own.
          </h4>
        </Box>

        {exchange && (
          <React.Fragment>
            <DashboardHeader />
            <Box className="pageContent">
              <Component {...props} />
            </Box>
            <Box className="faq">
              <FAQ />
            </Box>
          </React.Fragment>
        )}
        {!exchange && (
          <Box
            className="noExchangeBox"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
          >
            <span className="title">
              <b onClick={() => setExchange(true)}>Connect Exchange Account</b>{" "}
              to set up your exchange
            </span>
            <span className="text">
              To be able to trade on Zignaly you need to connect or create at
              least one exchange accounts like <b>Binance</b> or <b>KuCoin</b>.
            </span>
          </Box>
        )}
      </Box>
    )
  }
  WrapperComponent.displayName = `Layout(${getDisplayName(Component)})`
  return WrapperComponent
}

export default withDashboardLayout
