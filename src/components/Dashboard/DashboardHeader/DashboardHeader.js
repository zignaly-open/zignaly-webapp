import React from "react"
import "./DashboardHeader.scss"
import { Box } from "@material-ui/core"
import SubNavHeader from "../../SubNavHeader"

const DashboardHeader = () => {
  const links = [
    {
      name: "Positions",
      to: "/dashboard/positions",
    },
    {
      name: "Balance",
      to: "/dashboard/balance",
    },
    {
      name: "Connected traders",
      to: "/dashboard/connectedTraders",
    },
  ]
  return (
    <Box className="dashboardHeader hideScroll">
      <SubNavHeader links={links} />
    </Box>
  )
}

export default DashboardHeader
