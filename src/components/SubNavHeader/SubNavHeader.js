import React from "react"
import PropTypes from "prop-types"
import { Box } from "@material-ui/core"
import Link from "../LocalizedLink"
import "./SubNavHeader.scss"

const SubNavHeader = ({ links, children }) => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
      alignItems="center"
      className="subNavHeader"
    >
      {links.map((item, index) => (
        <Link
          to={item.to}
          className="dashboardLink"
          activeClassName="active"
          key={index}
        >
          {item.name}
        </Link>
      ))}
      {children}
    </Box>
  )
}
SubNavHeader.propTypes = {
  links: PropTypes.array.isRequired,
  children: PropTypes.node,
}
export default SubNavHeader
