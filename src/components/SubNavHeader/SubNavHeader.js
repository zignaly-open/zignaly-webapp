import React, { useState } from "react";
import { Box, Link } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import GatsbyLink from "../LocalizedLink";
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
  const [selectedLink, setSelectedLink] = useState(links.length ? links[0].id : "");
  return (
    <Box
      alignItems="center"
      className="subNavHeader hideScroll"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
    >
      {links.map((item, index) =>
        item.onClick ? (
          <Link
            // className={"dashboardLink " + window.location.hash === item.to ? "active" : null}
            className={`dashboardLink ${selectedLink === item.id ? "active" : null}`}
            key={index}
            // href={item.to}
            onClick={() => {
              setSelectedLink(item.id);
              item.onClick();
            }}
          >
            <FormattedMessage id={item.id} />
          </Link>
        ) : (
          <GatsbyLink activeClassName="active" className="dashboardLink" key={index} to={item.to}>
            <FormattedMessage id={item.id} />
          </GatsbyLink>
        ),
      )}
      {rightComponent && rightComponent}
    </Box>
  );
};

export default SubNavHeader;
