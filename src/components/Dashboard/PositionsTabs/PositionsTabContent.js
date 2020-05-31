import React, { useState } from "react";
import PositionFilters from "../PositionFilters";
import { Box } from "@material-ui/core";
import PositionsTable from "../PositionsTable";
import usePositionsList from "../../../hooks/usePositionsList";
import NoPositions from "../NoPositions";
import { isEmpty, take } from "lodash";

/**
 * @typedef {import("../../../hooks/usePositionsList").PositionsCollectionType} PositionsCollectionType
 * @typedef {Object} PositionsTabContentProps
 * @property {PositionsCollectionType} type
 * @property {React.MouseEventHandler} toggleFilters
 * @property {boolean} filtersVisibility
 */

/**
 * Component that display user positions tab content.
 *
 * @param {PositionsTabContentProps} props Component properties.
 * @returns {JSX.Element} Positions tab content element.
 */

const PositionsTabContent = (props) => {
  const { type, filtersVisibility, toggleFilters } = props;
  const positions = usePositionsList(type);
  const positionsFiltered = take(positions, 100);
  const handleFiltersChange = () => {};

  return (
    <>
      {filtersVisibility && (
        <PositionFilters
          onChange={handleFiltersChange}
          onClose={toggleFilters}
          positions={positions}
        />
      )}
      {type === "open" && (
        <Box className="tabPanel">
          {isEmpty(positions) ? (
            <NoPositions />
          ) : (
            <PositionsTable positions={positionsFiltered} type={type} />
          )}
        </Box>
      )}
      {type === "closed" && (
        <Box className="tabPanel">
          {isEmpty(positions) ? (
            <NoPositions />
          ) : (
            <PositionsTable positions={positionsFiltered} type={type} />
          )}
        </Box>
      )}
      {type === "log" && (
        <Box className="tabPanel">
          {isEmpty(positions) ? (
            <NoPositions />
          ) : (
            <PositionsTable positions={positionsFiltered} type={type} />
          )}
        </Box>
      )}
    </>
  );
};

export default PositionsTabContent;
