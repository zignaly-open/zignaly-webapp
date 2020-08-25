import React from "react";
import "./SelectionActions.scss";
import { Box } from "@material-ui/core";
import CustomButton from "../../../../CustomButton";

/**
 *
 * @typedef {import('../../../../../services/tradeApiClient.types').ManagementPositionsEntity} ManagementPositionsEntity
 * @typedef {Object} DefaultProps
 * @property {Array<ManagementPositionsEntity>} [values]
 * @property {Array<String>} selectedRows
 */

/**
 * Expanded rows component for management table.
 *
 * @param {DefaultProps} props Default component props.
 * @returns {JSX.Element} JSX component.
 */
const SelectionActions = ({ selectedRows }) => {
  return (
    <Box
      alignItems="center"
      className="selectionActions"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
    >
      <CustomButton className="textPurple" disabled={!selectedRows.length}>
        Cancel Entries
      </CustomButton>
      <CustomButton className="textPurple" disabled={!selectedRows.length}>
        Exit Entries
      </CustomButton>
    </Box>
  );
};

export default SelectionActions;
