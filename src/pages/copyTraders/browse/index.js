import React, { useState } from "react"
import { Box, Typography } from "@material-ui/core"
import { compose } from "recompose"
import withAppLayout from "../../../layouts/appLayout"
import withCopyTradersLayout from "../../../layouts/copyTradersLayout"
import withPageContext from "../../../pageContext"
import TraderCard from "../../../components/TraderCard"
import PositionFilters from "../../../components/Dashboard/PositionFilters"
import SelectTimeFrame from "../../../components/SelectTimeFrame"
import Helmet from "react-helmet"
import "./copyTradersBrowse.sass"

const CopyTradersBrowse = () => {
  const list = [1, 2, 3]
  const [filters, showFilters] = useState(false)
  const handleTimeFrameChange = val => {
    console.log(val)
  }

  return (
    <Box className="ctBrowsePage">
      <Helmet>
        <title>Copy Traders</title>
      </Helmet>

      {filters && <PositionFilters onClose={() => showFilters(false)} />}
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Typography variant="h3" className="regularHeading">
          7 traders
        </Typography>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="flex-end"
          alignItems="center"
        >
          <SelectTimeFrame onChange={handleTimeFrameChange} />
        </Box>
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
)(CopyTradersBrowse)
