import React from "react";
import { Helmet } from "react-helmet";
import Wall from "../../../components/Provider/News/Wall";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";
import { useIntl } from "react-intl";

const CopyTradersNews = () => {
  const intl = useIntl();
  const storeViews = useStoreViewsSelector();

  return (
    <>
      <Helmet>
        <title>
          {`${storeViews.provider.name} - ${intl.formatMessage({
            id: "srv.newsfeed",
          })}`}
        </title>
      </Helmet>
      <Wall provider={storeViews.provider} />
    </>
  );
};

export default CopyTradersNews;
