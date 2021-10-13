import React from "react";
import { Link } from "gatsby";

/**
 *
 * TODO: This fix type override is is needed until Gatsby fix:
 * https://github.com/gatsbyjs/gatsby/issues/16682
 * @typedef {import("gatsby").GatsbyLinkProps<any>} GatsbyLinkProps
 * @typedef {GatsbyLinkProps & {ref?: React.LegacyRef<Link<any>>, type?: string, key?: number}} GatsbyLinkPropsFix
 */

/**
 * Localized link component.
 *
 * TODO: We removed paths localization so this will be just a Link wrapper.
 *
 * @param {GatsbyLinkPropsFix} props Link properties.
 *
 * @returns {JSX.Element} Localized link element.
 */
const LocalizedLink = (props) => {
  const { to } = props;
  return <Link {...props} to={to} />;
};

export default LocalizedLink;
