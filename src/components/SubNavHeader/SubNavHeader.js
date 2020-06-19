import React, { useContext } from "react";
import { Box, Link } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import GatsbyLink from "../LocalizedLink";
import ModalPathContext from "../ConnectExchangeView/ModalPathContext";
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
const SubNavHeader = ({ links, rightComponent }) => (
  <Box
    alignItems="center"
    className="subNavHeader hideScroll"
    display="flex"
    flexDirection="row"
    justifyContent="flex-start"
  >
    {links.map((item, index) => (
      <GatsbyLink activeClassName="active" className="dashboardLink" key={index} to={item.to}>
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
 */

/**
 * Provides a navigation bar to display links with optional elements.
 *
 * @param {SubNavModalHeaderTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
export const SubNavModalHeader = ({ links }) => {
  const {
    pathParams: { currentPath },
    resetToPath,
  } = useContext(ModalPathContext);

  return (
    <Box
      alignItems="center"
      className="subNavHeader hideScroll"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
    >
      {links.map((item, index) => (
        <Link
          // className={"dashboardLink " + window.location.hash === item.to ? "active" : null}
          className={`dashboardLink ${currentPath === item.id ? "active" : null}`}
          key={index}
          // href={item.to}
          onClick={() => resetToPath(item.id)}
        >
          <FormattedMessage id={item.title} />
        </Link>
      ))}
    </Box>
  );
};

export default SubNavHeader;
