import React from "react";
import PropTypes from "prop-types";
import { Box } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import Link from "../LocalizedLink";
import "./SubNavHeader.scss";

/**
 * @typedef {import("../../utils/routesMapping").NavigationLink} NavigationLink
 *
 * @typedef {Object} SubNavHeaderPropTypes
 * @property {Array<NavigationLink>} links Array of link translation id and path.
 * @property {*} [children] Optional elements to display in the header.
 */

/**
 * Provides a navigation bar to display links with optional elements.
 *
 * @param {SubNavHeaderPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
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
          <FormattedMessage id={item.id} />
        </Link>
      ))}
      {children}
    </Box>
  );
};

SubNavHeader.defaultProps = {
  children: null,
};

SubNavHeader.propTypes = {
  children: PropTypes.node,
  links: PropTypes.array.isRequired,
};
export default SubNavHeader;
