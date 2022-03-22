import React, { useState, useEffect } from "react";
import "./ExpandedRow.scss";
import { TableRow, TableCell, Checkbox, CircularProgress } from "@mui/material";
import useStoreSettingsSelector from "../../../../../hooks/useStoreSettingsSelector";
import { composeManagementPositionsDataTable } from "../../../../../utils/composePositionsDataTable";

/**
 *
 * @typedef {import('../../../../../services/tradeApiClient.types').ManagementPositionsEntity} ManagementPositionsEntity
 * @typedef {Object} TransformedObject
 * @property {String} id
 * @property {String|Number|JSX.Element} data
 *
 * @typedef {Object} DefaultProps
 * @property {Array<ManagementPositionsEntity>} values
 * @property {String} persistKey
 * @property {React.MouseEventHandler} confirmAction
 * @property {Number} index Index of parent row.
 * @property {Function} onSelectionChange
 * @property {Function} onAllSelection
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
  onAllSelection,
}) => {
  const [list, setList] = useState([]);
  const [checkedAll, setCheckedAll] = useState(false);
  const storeSettings = useStoreSettingsSelector();

  const prepareList = () => {
    if (values.length) {
      let positions = values[index] ? values[index].subPositions : [];
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

  useEffect(prepareList, [values]);

  const checkIfAllChecked = () => {
    if (selectedRows.length) {
      let allSelected = true;
      const subPositions = values[index] ? values[index].subPositions : [];
      subPositions.forEach((position) => {
        if (!selectedRows.includes(position.positionId)) {
          allSelected = false;
        }
      });
      if (allSelected) {
        setCheckedAll(true);
      } else {
        setCheckedAll(false);
      }
    }
  };

  useEffect(checkIfAllChecked, [selectedRows]);

  /**
   *
   * @param {React.ChangeEvent<*>} e Change Event.
   * @param {Array<TransformedObject>} rowData Position Entity.
   * @returns {Void} None.
   */
  const handleChange = (e, rowData) => {
    const obj = rowData.find((item) => item.id === "positionId");
    onSelectionChange(index, obj.data);
  };

  /**
   *
   * @param {React.ChangeEvent<*>} e Change Event.
   * @returns {Void} None.
   */
  const handleChangeAll = (e) => {
    setCheckedAll(e.target.checked);
    onAllSelection(index, e.target.checked);
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

  /**
   *
   * @param {Array<TransformedObject>} rowData Position Entity.
   * @returns {Boolean} Whether input is checked or not.
   */
  const updating = (rowData) => {
    const obj = rowData.find((item) => item.id === "positionId");
    const subPositions = values[index] ? values[index].subPositions : [];
    const position = subPositions.find((item) => item.positionId === obj.data.toString());
    if (position && position.updating) {
      return true;
    }
    return false;
  };

  const showCheckAllButton = () => {
    const subPositions = values[index] ? values[index].subPositions : [];
    const updatingPositions = subPositions.filter((item) => item.updating);
    if (subPositions.length === updatingPositions.length) {
      return false;
    }
    return true;
  };

  return (
    <>
      {list.map((row, i) => (
        <TableRow className="expandedRows" key={i}>
          {i === 0 && showCheckAllButton() ? (
            <TableCell className="checkboxCell">
              <Checkbox
                checked={checkedAll}
                className="checkbox"
                onChange={(e) => handleChangeAll(e)}
              />
            </TableCell>
          ) : (
            <TableCell>&nbsp;</TableCell>
          )}
          {!updating(row) ? (
            <TableCell className="checkboxCell">
              <Checkbox
                checked={checkedStatus(row)}
                className="checkbox"
                onChange={(e) => handleChange(e, row)}
              />
            </TableCell>
          ) : (
            <TableCell className="checkboxCell">
              <CircularProgress color="primary" size={30} />
            </TableCell>
          )}
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
