import React from "react";
import { Link } from "gatsby";
import { getLocalizedPath } from "../../i18n";
import { PageContext } from "../../pageContext";

/**
 * @typedef {Object} LocalizedLinkProps
 * @property {string} to
 */

/**
 * Localized link component.
 *
 * @param {LocalizedLinkProps} props Link properties.
 *
 * @returns {JSX.Element} Localized link element.
 */
const LocalizedLink = (props) => {
  const { to } = props;
  return (
    <PageContext.Consumer>
      {({ locale }) => <Link {...props} to={getLocalizedPath(to, locale)} />}
    </PageContext.Consumer>
  );
};

export default LocalizedLink;
