import React from "react";
import { Box, Link } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import GatsbyLink from "../LocalizedLink";
import "./SubNavHeader.scss";

/**
 * @typedef {import('@reach/router').LinkGetProps} LinkGetProps
 */

/**
 * Apply active class if current url matches the link (ignore trailing slash)
 * @param {LinkGetProps} props props
 * @returns {Object} link props
 */
const isPartiallyActive = (props) => {
  const currentPath = props.location.pathname.replace(/\/$/, "");
  const match = currentPath === props.href;
  return { className: `dashboardLink ${match ? "active" : ""}` };
};

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
const SubNavHeader = ({ links, rightComponent }) => (
  <Box
    alignItems="flex-start"
    className="subNavHeader"
    display="flex"
    flexDirection="row"
    justifyContent="flex-start"
  >
    {links.map((item, index) => (
      <GatsbyLink getProps={isPartiallyActive} key={index} to={item.to}>
        <FormattedMessage id={item.id} />
      </GatsbyLink>
    ))}
    {rightComponent && rightComponent}
  </Box>
);

/**
 * @typedef {Object} ModalNavigationLink Modal navigation link object.
 * @property {string} id Path ID.
 * @property {string} title Link title.
 */

/** *
 * @typedef {Object} SubNavModalHeaderTypes
 * @property {Array<ModalNavigationLink>} links Array of path id/title.
 * @property {string} currentPath Current path
 * @property {function(string): *} onClick onClick callback
 */

/**
 * Provides a navigation bar to display links with optional elements.
 *
 * @param {SubNavModalHeaderTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
export const SubNavModalHeader = ({ links, currentPath, onClick }) => {
  return (
    <Box
      alignItems="center"
      className="subNavHeader"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
    >
      {links.map((item, index) => (
        <Link
          className={`dashboardLink ${currentPath === item.id ? "active" : null}`}
          key={index}
          onClick={() => onClick(item.id)}
        >
          <FormattedMessage id={item.title} />
        </Link>
      ))}
    </Box>
  );
};

export default SubNavHeader;
