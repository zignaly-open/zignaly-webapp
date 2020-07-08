import React from "react";
import { Box } from "@material-ui/core";
import { Helmet } from "react-helmet";
import { PositionsTabs } from "../../../components/Dashboard/PositionsTabs";
import { useIntl } from "react-intl";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";

const CopyTradersPositions = () => {
  const intl = useIntl();
  const storeViews = useStoreViewsSelector();

  return (
    <>
      <Helmet>
        <title>
          {`${storeViews.provider.name} | ${intl.formatMessage({
            id: "srv.positions",
          })}`}
        </title>
      </Helmet>
      <Box className="positionsPage" display="flex" flexDirection="row" justifyContent="center">
        <PositionsTabs isProfile={true} />
      </Box>
    </>
  );
};

export default CopyTradersPositions;
