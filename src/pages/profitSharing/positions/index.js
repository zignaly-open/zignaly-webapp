import React from "react";
import { Box } from "@mui/material";
import { Helmet } from "react-helmet";
import { PositionsTabs } from "../../../components/Dashboard/PositionsTabs";
import { useIntl } from "react-intl";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";
import usePositionsContext from "../../../hooks/usePositionsContext";
import PositionsContext from "../../../components/Dashboard/PositionsContext";

const CopyTradersPositions = () => {
  const intl = useIntl();
  const storeViews = useStoreViewsSelector();
  const context = usePositionsContext();

  return (
    <>
      <Helmet>
        <title>
          {`${storeViews.provider.name} - ${intl.formatMessage({
            id: "srv.positions",
          })} | ${intl.formatMessage({ id: "product" })}`}
        </title>
      </Helmet>
      <Box className="positionsPage" display="flex" flexDirection="row" justifyContent="center">
        <PositionsContext.Provider value={context}>
          <PositionsTabs isProfile={true} />
        </PositionsContext.Provider>
      </Box>
    </>
  );
};

export default CopyTradersPositions;
