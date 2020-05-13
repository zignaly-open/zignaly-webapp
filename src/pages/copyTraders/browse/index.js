import React from "react"
import { Box, Typography } from "@material-ui/core"
import { compose } from "recompose"
import withAppLayout from "../../../layouts/appLayout"
import withCopyTradersLayout from "../../../layouts/copyTradersLayout"
import withPageContext from "../../../pageContext"
import TraderCard from "../../../components/TraderCard"
import Helmet from "react-helmet"
import "./cTBrowse.sass"

const CTBrowse = () => {
  const list = [1, 2, 3]

  return (
    <Box className="ctBrowsePage">
      <Helmet>
        <title>Copy Traders</title>
      </Helmet>
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Typography variant="h3" className="regularHeading">
          7 traders
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" justifyContent="flex-start">
        <Box
          className="tradersBox"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
        >
          {list &&
            list.map(item => (
              <TraderCard key={item} data={item} showSummary={false} />
            ))}
        </Box>
      </Box>
    </Box>
  )
}

export default compose(
  withPageContext,
  withAppLayout,
  withCopyTradersLayout
)(CTBrowse)
