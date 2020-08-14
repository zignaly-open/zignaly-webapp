import React, { useState, useEffect } from "react";
import "./ExpandedRow.scss";
import { TableRow, TableCell } from "@material-ui/core";
import useStoreSettingsSelector from "../../../../hooks/useStoreSettingsSelector";
import { composeManagementPositionsDataTable } from "../../../../utils/composePositionsDataTable";

/**
 *
 * @typedef {import('../../../../services/tradeApiClient.types').PositionEntity} PositionEntity
 * @typedef {import('../../../../services/tradeApiClient.types').ManagementPositionsEntity} ManagementPositionsEntity
 * @typedef {Object} TranformedObject
 * @property {String} id
 * @property {String|Number|JSX.Element} data
 *
 * @typedef {Object} DefaultProps
 * @property {Array<ManagementPositionsEntity>} values
 * @property {String} persistKey
 * @property {React.MouseEventHandler} confirmAction
 * @property {Number} index
 */

/**
 * Expanded rows component for management table.
 *
 * @param {DefaultProps} props Default component props.
 * @returns {JSX.Element} JSX component.
 */
const ExpandedRow = ({ values, persistKey, confirmAction, index }) => {
  const [list, setList] = useState([]);
  const storeSettings = useStoreSettingsSelector();

  const prepareList = () => {
    if (values.length) {
      let positions = values[index].subPositions;
      let newList = [];
      let transformed = composeManagementPositionsDataTable(positions, confirmAction);
      let { data, columns } = transformed;
      for (let a = 0; a < positions.length; a++) {
        let transformedRow = [];
        for (let b = 0; b < columns.length; b++) {
          /**
           * @type {TranformedObject}
           */
          let obj = { id: "", data: "" };
          obj.id = columns[b].name;
          obj.data = data[a][b];
          transformedRow.push(obj);
        }
        newList[a] = transformedRow;
      }

      setList([...newList]);
    }
  };

  useEffect(prepareList, []);

  return (
    <>
      {list.map((row, i) => (
        <TableRow className="expandedRows" key={i}>
          <TableCell>&nbsp;</TableCell>
          <TableCell>&nbsp;</TableCell>
          {row.map(
            /* @ts-ignore */
            (cell, i2) =>
              cell.id !== "subPositions" &&
              storeSettings.displayColumns[persistKey].includes(cell.id) && (
                <TableCell key={i2}> {cell.data} </TableCell>
              ),
          )}
        </TableRow>
      ))}
    </>
  );
};

export default ExpandedRow;
