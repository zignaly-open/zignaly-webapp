import React, { useState } from "react";
import PositionFilters from "../PositionFilters";
import { Box } from "@material-ui/core";
import PositionsTable from "../PositionsTable";
import usePositionsList from "../../../hooks/usePositionsList";
import NoPositions from "../NoPositions";
import { isEmpty } from "lodash";

/**
 * @typedef {import("../../../hooks/usePositionsList").PositionsCollectionType} PositionsCollectionType
 */

/**
 * @typedef {Object} PositionsTabContentProps
 * @property {PositionsCollectionType} type
 */

/**
 * Component that display user positions tab content.
 *
 * @param {PositionsTabContentProps} props Component properties.
 * @returns {JSX.Element} Positions tab content element.
 */

const PositionsTabContent = (props) => {
  const { type } = props;
  const positions = usePositionsList(type);
  const [filters, showFilters] = useState(false);
  const handleFiltersChange = () => {};

  return (
    <>
      {filters && (
        <PositionFilters onChange={handleFiltersChange} onClose={() => showFilters(false)} />
      )}
      {type === "open" && (
        <Box className="tabPanel">
          {isEmpty(positions) ? (
            <NoPositions />
          ) : (
            <PositionsTable positions={positions} type={type} />
          )}
        </Box>
      )}
      {type === "closed" && (
        <Box className="tabPanel">
          {isEmpty(positions) ? (
            <NoPositions />
          ) : (
            <PositionsTable positions={positions} type={type} />
          )}
        </Box>
      )}
      {type === "log" && (
        <Box className="tabPanel">
          {isEmpty(positions) ? (
            <NoPositions />
          ) : (
            <PositionsTable positions={positions} type={type} />
          )}
        </Box>
      )}
    </>
  );
};

export default PositionsTabContent;
