import React from "react";
import { Box } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import Link from "../LocalizedLink";
import "./SubNavHeader.scss";

/**
 * @typedef {import("../../utils/routesMapping").NavigationLink} NavigationLink
 *
 * @typedef {Object} SubNavHeaderPropTypes
 * @property {Array<NavigationLink>} links Array of link translation id and path.
 * @property {Object} [rightComponent] Optional component to display at the right of the menu.
 */

/**
 * Provides a navigation bar to display links with optional elements.
 *
 * @param {SubNavHeaderPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const SubNavHeader = ({ links, rightComponent }) => {
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
      {rightComponent && rightComponent}
    </Box>
  );
};

export default SubNavHeader;
