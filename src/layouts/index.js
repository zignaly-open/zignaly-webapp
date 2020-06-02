import React from "react";
import { compose } from "recompose";
import withPageContext from "../pageContext";
import PrivateAreaLayout from "./PrivateAreaLayout";

/**
 * @typedef {Object} PageContext
 * @property {string} layout
 */

/**
 * @typedef {Object} Location
 * @property {string} pathname
 */

/**
 * @typedef {Object} WrapRootLayoutProps
 * @property {React.FunctionComponent} children
 * @property {Location} location
 */

/**
 * Wrap Gatsby root element in
 *
 * @param {WrapRootLayoutProps} props Wrapper properties.
 * @returns {JSX.Element} Root layout element.
 */
const wrapRootWithLayout = (props) => {
  const { children, location } = props;
  const currentPath = location.pathname || "";
  const PublicPage = () => <>{children}</>;
  const PrivatePage = () => <PrivateAreaLayout>{children}</PrivateAreaLayout>;

  // Login don't use any layout.
  if (currentPath.match("/login")) {
    return PublicPage();
  }

  return PrivatePage();
};

export default wrapRootWithLayout;
