import React from "react";
import { Link } from "gatsby";

import { getLocalizedPath } from "../../i18n";
import { PageContext } from "../../pageContext";

const LocalizedLink = ({ to, ...props }) => (
    <PageContext.Consumer>
        {({ locale }) => <Link {...props} to={getLocalizedPath(to, locale)} />}
    </PageContext.Consumer>
);

export default LocalizedLink;
