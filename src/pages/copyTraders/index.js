import React from "react"
import { Box, Typography } from "@material-ui/core"
import { compose } from "recompose"
import withAppLayout from "../../layouts/appLayout"
import withCopyTradersLayout from "../../layouts/copyTradersLayout"
import withPageContext from "../../pageContext"
import TraderCard from "../../components/TraderCard"
import Helmet from "react-helmet"

const CopyTraders = () => {
  const list = [1, 2, 3]

  return (
    <React.Fragment>
      <Helmet>
        <title>Copy Traders</title>
      </Helmet>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        className="dashboard"
      >
        <h1>I will be the Copy Traders</h1>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        className="connectedTradersPage"
      >
        <Box className="headlineBox">
          <Typography variant="h4">Traders I am copying:</Typography>
        </Box>
        <Box
          className="tradersBox"
          display="flex"
          flexDirection="row"
          justifyContent="flex-start"
          alignItems="center"
          flexWrap="wrap"
        >
          {list && list.map(item => <TraderCard key={item} data={item} />)}
        </Box>
      </Box>
    </React.Fragment>
  )
}

export default compose(
  withPageContext,
  withAppLayout,
  withCopyTradersLayout
)(CopyTraders)
