import React from "react";
import { Helmet } from "react-helmet";
import { compose } from "recompose";
import withLayout from "../layouts/appLayout";
import astronaut from "../images/gatsby-astronaut.png";

const IndexPage = () => (
  <>
    <Helmet>
      <title>Zignaly</title>
    </Helmet>
    <main>
      <img alt="" src={astronaut} />
    </main>
  </>
);

export default compose(withLayout)(IndexPage);
