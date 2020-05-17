import React from "react";
import PropTypes from "prop-types";
import { Box } from "@material-ui/core";
import Link from "../LocalizedLink";
import "./SubNavHeader.scss";

const SubNavHeader = ({ links, children }) => {
  return (
    <Box
      alignItems="center"
      className="subNavHeader hideScroll"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
    >
      {links.map((item, index) => (
        <Link activeClassName="active" className="dashboardLink" key={index} to={item.to}>
          {item.name}
        </Link>
      ))}
      {children}
    </Box>
  );
};
SubNavHeader.propTypes = {
  links: PropTypes.array.isRequired,
  children: PropTypes.node,
};
export default SubNavHeader;
