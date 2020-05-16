import React from "react"
import "./DashboardHeader.scss"
import { Box } from "@material-ui/core"
import { injectIntl } from "react-intl"
import SubNavHeader from "../../SubNavHeader"

const DashboardHeader = ({ intl }) => {
  const links = [
    {
      name: intl.formatMessage({ id: "dashboard.positions" }),
      to: "/dashboard/positions",
    },
    {
      name: intl.formatMessage({ id: "dashboard.balance" }),
      to: "/dashboard/balance",
    },
    {
      name: intl.formatMessage({ id: "dashboard.traders" }),
      to: "/dashboard/connectedTraders",
    },
  ]
  return (
    <Box className="dashboardHeader">
      <SubNavHeader links={links} />
    </Box>
  )
}

export default injectIntl(DashboardHeader)
