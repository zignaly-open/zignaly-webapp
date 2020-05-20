import React from "react";
import Helmet from "react-helmet";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import { compose } from "recompose";

import withPageContext from "../pageContext";
import withLayout from "../layouts/appLayout";

import astronaut from "../images/gatsby-astronaut.png";

const IndexPage = () => (
  <>
    <Helmet>
      <title>Zignaly</title>
    </Helmet>
    <main>
      <FormattedHTMLMessage id="home.main" tagName="div" />
      <img alt="" src={astronaut} />
    </main>
  </>
);

export default compose(withPageContext, withLayout, injectIntl)(IndexPage);
