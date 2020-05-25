import React from "react";
import { Link } from "gatsby";
import { getLocalizedPath } from "../../i18n";
import { PageContext } from "../../pageContext";

/**
 *
 * TODO: This fix type override is is needed until Gatsby fix:
 * https://github.com/gatsbyjs/gatsby/issues/16682
 * @typedef {import("gatsby").GatsbyLinkProps<any>} GatsbyLinkProps
 * @typedef {GatsbyLinkProps & {ref: React.LegacyRef<Link<any>>}} GatsbyLinkPropsFix
 */

/**
 * Localized link component.
 *
 * @param {GatsbyLinkPropsFix} props Link properties.
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
