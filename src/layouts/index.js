import React from "react";
import PrivateAreaLayout from "./PrivateAreaLayout";
import AppLayout from "./AppLayout";

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
  const PublicPage = () => <AppLayout>{children}</AppLayout>;
  const PrivatePage = () => (
    <AppLayout>
      <PrivateAreaLayout>{children}</PrivateAreaLayout>
    </AppLayout>
  );

  // Login don't use any layout.
  if (currentPath.match("/login")) {
    return PublicPage();
  }
  // Root page is just to redirect
  if (currentPath === "/") {
    return PublicPage();
  }
  // Signup don't use any layout.
  if (currentPath.match("/signup")) {
    return PublicPage();
  }
  // Recover don't use any layout.
  if (currentPath.match("/recover")) {
    return PublicPage();
  }

  return PrivatePage();
};

export default wrapRootWithLayout;
