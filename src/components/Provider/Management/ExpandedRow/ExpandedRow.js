import React, { useState, useEffect } from "react";
import "./ExpandedRow.scss";
import { TableRow, TableCell, Checkbox } from "@material-ui/core";
import useStoreSettingsSelector from "../../../../hooks/useStoreSettingsSelector";
import { composeManagementPositionsDataTable } from "../../../../utils/composePositionsDataTable";

/**
 *
 * @typedef {import('../../../../services/tradeApiClient.types').PositionEntity} PositionEntity
 * @typedef {import('../../../../services/tradeApiClient.types').ManagementPositionsEntity} ManagementPositionsEntity
 * @typedef {Object} TransformedObject
 * @property {String} id
 * @property {String|Number|JSX.Element} data
 *
 * @typedef {Object} DefaultProps
 * @property {Array<ManagementPositionsEntity>} values
 * @property {String} persistKey
 * @property {React.MouseEventHandler} confirmAction
 * @property {Number} index
 * @property {Function} onSelectionChange
 * @property {Array<String>} selectedRows
 */

/**
 * Expanded rows component for management table.
 *
 * @param {DefaultProps} props Default component props.
 * @returns {JSX.Element} JSX component.
 */
const ExpandedRow = ({
  values,
  persistKey,
  confirmAction,
  index,
  onSelectionChange,
  selectedRows,
}) => {
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
           * @type {TransformedObject}
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

  /**
   *
   * @param {React.ChangeEvent<*>} e Change Event.
   * @param {Array<TransformedObject>} rowData Position Entity.
   * @returns {Void} None.
   */
  const handleChange = (e, rowData) => {
    const obj = rowData.find((item) => item.id === "positionId");
    onSelectionChange(obj.data);
  };

  /**
   *
   * @param {Array<TransformedObject>} rowData Position Entity.
   * @returns {Boolean} Whether input is checked or not.
   */
  const checkedStatus = (rowData) => {
    const obj = rowData.find((item) => item.id === "positionId");
    if (selectedRows.includes(obj.data.toString())) {
      return true;
    }
    return false;
  };

  return (
    <>
      {list.map((row, i) => (
        <TableRow className="expandedRows" key={i}>
          <TableCell className="checboxCell">
            <Checkbox checked={checkedStatus(row)} onChange={(e) => handleChange(e, row)} />
          </TableCell>
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
