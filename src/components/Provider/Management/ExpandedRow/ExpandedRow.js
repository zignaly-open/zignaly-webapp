import React, { useState, useEffect, Fragment } from "react";
import "./ExpandedRow.scss";
import { TableRow, TableCell } from "@material-ui/core";
import useStoreSettingsSelector from "../../../../hooks/useStoreSettingsSelector";
import { composeManagementPositionsDataTable } from "../../../../utils/composePositionsDataTable";

/**
 *
 * @typedef {import('../../../../services/tradeApiClient.types').PositionEntity} PositionEntity
 * @typedef {Object} TranformedObject
 * @property {String} id
 * @property {String|Number|Element} data
 *
 * @typedef {Object} DefaultProps
 * @property {Object} values
 * @property {String} persistKey
 * @property {React.MouseEventHandler} confirmAction
 * @property {Number} index
 */

/**
 * Expanded rows component for management table.
 *
 * @param {DefaultProps} props
 * @returns {JSX.Element} JSX component.
 */
const ExpandedRow = ({ values, persistKey, confirmAction, index }) => {
  const [list, setList] = useState([]);
  const storeSettings = useStoreSettingsSelector();

  const prepareList = () => {
    let userMapping = Object.values(values);
    let expanded = [...userMapping[index]];
    expanded.splice(0, 1);
    let newList = [];
    let transformed = composeManagementPositionsDataTable(expanded, confirmAction);
    let { data, columns } = transformed;
    for (let a = 0; a < expanded.length; a++) {
      let transformedList = [];
      for (let b = 0; b < columns.length; b++) {
        /**
         * @type {TranformedObject}
         */
        let obj = { id: "", data: "" };
        obj.id = columns[b].name;
        /*@ts-ignore */
        obj.data = data[a][b];
        transformedList.push(obj);
      }
      newList[a] = transformedList;
    }
    setList([...newList]);
  };

  useEffect(prepareList, []);

  return (
    <Fragment>
      {list.map((row, i) => (
        <TableRow key={i} className="expandedRows">
          <TableCell>&nbsp;</TableCell>
          <TableCell>&nbsp;</TableCell>

          {row.map(
            (cell, i2) =>
              cell.id !== "col.provider.subpositions" &&
              storeSettings.displayColumns[persistKey].includes(cell.id) && (
                <TableCell key={i2}> {cell.data} </TableCell>
              ),
          )}
        </TableRow>
      ))}
    </Fragment>
  );
};

export default ExpandedRow;
