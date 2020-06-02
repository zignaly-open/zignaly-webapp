import React from "react";
import { compose } from "recompose";
import withAppLayout from "./appLayout/withAppLayout";
import withPageContext from "../pageContext";

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
 * @returns {Function} Root layout element.
 */
const wrapRootWithLayout = (props) => {
  const { children, location } = props;
  const currentPath = location.pathname || "";
  const MainElement = () => <>{children}</>;

  // Login don't use any layout.
  if (currentPath.match("/login")) {
    return MainElement;
  }

  // The rest of the pages are private are and use i18n context and app layout.
  /** @type {Function} composedLayout */
  const composedLayout = compose(withPageContext, withAppLayout)(MainElement);

  return composedLayout();
};

export default wrapRootWithLayout;
