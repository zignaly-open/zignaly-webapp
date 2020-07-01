import React, { useState, useEffect } from "react";
import "./ExpandedRow.scss";
import { TableRow, TableCell } from "@material-ui/core";

/**
 *
 * @typedef {import('../../../../services/tradeApiClient.types').PositionEntity} PositionEntity
 * @typedef {Object} DefaultProps
 * @property {Object} values
 * @property {Object} data
 */

/**
 * Expanded rows component for management table.
 *
 * @param {DefaultProps} props
 * @returns {JSX.Element} JSX component.
 */
const ExpandedRow = ({ values, data }) => {
  const [list, setList] = useState([]);

  const prepareList = () => {
    let userMapping = { ...values };
    let id = Object.values(data)[5];
  };

  useEffect(prepareList, []);

  return (
    <TableRow className="expandedRows">
      <TableCell>&nbsp;</TableCell>
      <TableCell>mmm</TableCell>
      <TableCell>mmm</TableCell>
      <TableCell>mmm</TableCell>
      <TableCell>mmm</TableCell>
    </TableRow>
  );
};

export default ExpandedRow;
